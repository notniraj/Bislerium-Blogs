namespace BIsleriumCW.Dtos
{
	public class TopPostDto
	{
		public int PostId { get; set; }
		public string Title { get; set; }
		public int TotalUpvotes { get; set; }
		public int TotalDownvotes { get; set; }
		public int TotalComments { get; set; }

	}
}
