namespace BIsleriumCW.Dtos
{
	public class TopBloggerDto
	{
		public string UserId { get; set; }
		public string Username { get; set; }
		public int TotalPosts { get; set; }
		public int TotalUpvotesReceived { get; set; }
		public int TotalCommentsReceived { get; set; }
	}
}
