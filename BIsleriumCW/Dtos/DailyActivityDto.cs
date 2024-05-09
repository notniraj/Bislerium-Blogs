namespace BIsleriumCW.Dtos
{
	public class DailyActivityDto
	{
		public DateTime Date { get; set; }
		public int BlogPostCount { get; set; }
		public int UpvoteCount { get; set; }
		public int DownvoteCount { get; set; }
		public int CommentCount { get; set; }
	}
}
