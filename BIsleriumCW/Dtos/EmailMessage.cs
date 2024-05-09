namespace BIsleriumCW.Dtos
{
	public class EmailMessage
	{
		public string Subject { get; set; }
		public string To { get; set; }
		public string Body { get; set; }

		public List<string> AttachmentPaths { get; set; } 

		public EmailMessage()
		{
			AttachmentPaths = new List<string>();
		}
	}

}
