using System.ComponentModel;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using SpacetimeDB;

public static partial class Module
{
    [Table(Name = "user", Public = true)]
    public partial class User
    {
        [PrimaryKey]
        public Identity Identity;
        public string? Name;
        public bool Online;
    }

    [Table(Name = "message", Public = true)]
    public partial class Message
    {
        [PrimaryKey]
        public Identity Id;
        public Identity Sender;
        public Timestamp Sent;
        public string Text = "";
    }


    [Reducer]
    public static void SetName(ReducerContext ctx, string name)
    {
        name = ValidateName(name);

        var user = ctx.Db.user.Identity.Find(ctx.Sender);
        if (user is not null)
        {
            user.Name = name;
            ctx.Db.user.Identity.Update(user);
        }
    }

    private static string ValidateName(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new Exception("Name cannot be empty or null.");
        }

        return name;
    }

    public static string GetRandomHexNumber(int digits, Identity? sender = null, Timestamp? timestamp = null)
    {
        string senderHex = sender?.ToString() ?? "";
        string timestampHex = timestamp.GetValueOrDefault().MicrosecondsSinceUnixEpoch.ToString("X");
        
        string combined = timestampHex + senderHex;

        if (combined.Length < digits)
        {
            combined = combined.PadRight(digits, '0');
        }
        else if (combined.Length > digits)
        {
            combined = combined.Substring(0, digits);
        }

        Log.Info($"Generated random hex number: {combined} (from sender: {senderHex}, timestamp: {timestampHex})");
        return combined;
    }

    [Reducer]
    public static void SendMessage(ReducerContext ctx, string text)
    {
        text = ValidateMessage(text);
        Identity id = Identity.FromHexString(GetRandomHexNumber(64, ctx.Sender, ctx.Timestamp));
        Log.Info($"({id}). {ctx.Sender.ToString()}: {text}");
        if(text.StartsWith("/nick "))
        {
            SetName(ctx, text.Substring(6).Trim());
            return;
        }
        ctx.Db.message.Insert(new Message
        {
            Sender = ctx.Sender,
            Text = text,
            Sent = ctx.Timestamp,
            Id = id
        });
    }

    private static string ValidateMessage(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            throw new Exception("Message cannot be empty or null.");
        }

        if (text.Length > 500)
        {
            throw new Exception("Message is too long.");
        }

        return text;
    }

    [Reducer(ReducerKind.ClientConnected)]
    public static void ClientConnected(ReducerContext ctx) {
        Log.Info($"Connect {ctx.Sender}");
        var user = ctx.Db.user.Identity.Find(ctx.Sender);

        if (user is not null)
        {
            user.Online = true;
            ctx.Db.user.Identity.Update(user);
        }
        else
        {
            ctx.Db.user.Insert(new User
            {
                Name = null,
                Identity = ctx.Sender,
                Online = true
            });
        }
    }

    [Reducer(ReducerKind.ClientDisconnected)]
    public static void ClientDisconnected(ReducerContext ctx)
    {
        var user = ctx.Db.user.Identity.Find(ctx.Sender);

        if (user is not null)
        {
            user.Online = false;
            ctx.Db.user.Identity.Update(user);
        }
        else
        {
            Log.Warn($"Client {ctx.Sender} disconnected but was not found in the database.");
        }
    }
}