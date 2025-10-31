using Microsoft.AspNetCore.Builder;

namespace AuthServiceApp
{
	public record User(string Username, string Email, string Password);

	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);
			
			builder.Services.AddCors(options =>
			{
				options.AddDefaultPolicy(policy =>
				{
					policy.AllowAnyOrigin()
						.AllowAnyHeader()
						.AllowAnyMethod();
				});
			});

			var app = builder.Build();
			
			app.UseCors();

			var users = new List<User>();

			// Seed a test user: username=testuser password=pass123
			users.Add(new User("testuser", "test@example.com", "pass123"));

			app.MapPost("/api/auth/register", (User user) =>
			{
				users.Add(user);
				return Results.Ok(new { message = "registered" });
			});

			app.MapPost("/api/auth/login", (User login) =>
			{
				var user = users.FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);
				if (user == null) return Results.Unauthorized();
				// Return a fake token for testing
				return Results.Ok(new { token = "fake-jwt-token", username = user.Username });
			});

			app.Run();
		}
	}
}
