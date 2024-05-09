using BIsleriumCW.Interfaces;
using System.Net.Mail;
using System.Net;
using BIsleriumCW.Dtos;

namespace BIsleriumCW.Services
{
    public class EmailService : IEmailService
    {
        private readonly string? _webAppBaseUrl;
        private readonly string? _from;
        private readonly SmtpClient _client;

        public EmailService(IConfiguration configuration)
        {
            _webAppBaseUrl = configuration["App:WebAppBaseUrl"];
            var userName = configuration["GmailCredentials:UserName"];
            var password = configuration["GmailCredentials:Password"];

            _from = userName;
            _client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(userName, password),
                UseDefaultCredentials = false,
                EnableSsl = true
            };
        }

        public async Task SendForgotPasswordEmailAsync(string name, string toEmail, string passwordResetToken)
        {
            var passwordResetUrl = $"{_webAppBaseUrl}/reset-password?token={ToUrlSafeBase64(passwordResetToken)}";
            var message = new EmailMessage
            {
                Subject = "Password Reset Request",
                To = toEmail,
                Body = @$"Dear {name},
                    To reset your password, please click on the following link:
                    {passwordResetUrl}"
            };
            await SendEmailAsync(message);
        }

        private async Task SendEmailAsync(EmailMessage message)
        {
            var mailMessage = new MailMessage(_from, message.To, message.Subject, message.Body);
            foreach (var attachmentPath in message.AttachmentPaths)
            {
                mailMessage.Attachments.Add(new Attachment(attachmentPath));
            }

            await _client.SendMailAsync(mailMessage);
        }

        private static string ToUrlSafeBase64(string base64String)
        {
            return base64String.Replace('+', '-').Replace('/', '_').Replace('=', '*');
        }
    }
}

