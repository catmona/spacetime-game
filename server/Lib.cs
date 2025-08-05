using System.ComponentModel;
using System.Net;
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
    
    static Random random = new Random();
    public static string GetRandomHexNumber(int digits)
    {
        byte[] buffer = new byte[digits / 2];
        random.NextBytes(buffer);
        string result = String.Concat(buffer.Select(x => x.ToString("X2")).ToArray());
        if (digits % 2 == 0)
            return result;
        return result + random.Next(16).ToString("X");
    }

    [Reducer]
    public static void SendMessage(ReducerContext ctx, string text)
    {
        text = ValidateMessage(text);
        Identity id = Identity.FromHexString(GetRandomHexNumber(64));
        Log.Info($"({id}). {ctx.Sender.ToString()}: {text}");
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