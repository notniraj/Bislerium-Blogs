using BIsleriumCW.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BIsleriumCW.Hubs
{
    public class NotificationHub : Hub <INotificationHub>
    {
        public async Task SendMessage(string user, string notification)
        {
            await Clients.All.SendMessage(user, notification);
        }
    }
}
