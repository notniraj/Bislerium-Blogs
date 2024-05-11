using BIsleriumCW.Dtos;

namespace BIsleriumCW.Interfaces
{
    public interface INotificationHub
    {
        public Task SendMessage(string user, string notification);
    }
}
