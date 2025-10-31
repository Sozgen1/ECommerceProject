using Microsoft.AspNetCore.Builder;
using System.Collections.Concurrent;

namespace ProductServiceApp
{
	public record Product(string Id, string Name, string Description, decimal Price, int StockQuantity);

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

			var products = new ConcurrentDictionary<string, Product>();

			// Seed some sample products for testing
			var id1 = Guid.NewGuid().ToString();
			products[id1] = new Product(id1, "Red T-Shirt", "Comfortable cotton tee", 19.99m, 50);
			var id2 = Guid.NewGuid().ToString();
			products[id2] = new Product(id2, "Blue Jeans", "Slim fit denim", 49.99m, 30);
			var id3 = Guid.NewGuid().ToString();
			products[id3] = new Product(id3, "Black Sneakers", "Lightweight running shoes", 79.99m, 20);

			app.MapGet("/api/products", () => Results.Ok(products.Values));

			app.MapPost("/api/products", (Product p) =>
			{
				var id = Guid.NewGuid().ToString();
				var prod = new Product(id, p.Name, p.Description, p.Price, p.StockQuantity);
				products[id] = prod;
				return Results.Created($"/api/products/{id}", prod);
			});

			app.MapDelete("/api/products/{id}", (string id) =>
			{
				if (products.TryRemove(id, out _)) return Results.NoContent();
				return Results.NotFound();
			});

			app.Run();
		}
	}
}
