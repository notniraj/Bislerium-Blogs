using BIsleriumCW.Interfaces;
using BIsleriumCW.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BIsleriumCW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IHubContext<NotificationHub, INotificationHub> messageHub;

        public MessageController (IHubContext<NotificationHub, INotificationHub> messageHub)
        {
            this.messageHub = messageHub;
        }

        [HttpGet]
        [Route("signalR-test")]
        public string GetMessage()
        {
            messageHub.Clients.All.SendMessage("Rohan", "This is SignalR Testing API");
            return "Notofication sent successfully to all users!";
        }

    }
}
