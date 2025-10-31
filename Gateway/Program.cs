using Microsoft.AspNetCore.Builder;
using System.Net.Http;

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

var httpClient = new HttpClient();

// Simple proxy: forward /api/products/* to productservice, /api/auth/* to authservice
app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/api/products"), proxyApp =>
{
	proxyApp.Run(async context =>
	{
		var forwardUri = new Uri("http://productservice:8080" + context.Request.Path + context.Request.QueryString);
		var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), forwardUri);

		// Copy headers
		foreach (var header in context.Request.Headers)
		{
			if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
			{
				requestMessage.Content ??= new StringContent(string.Empty);
				requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
			}
		}

		// Copy body if present
		if (context.Request.ContentLength > 0)
		{
			using var sr = new StreamReader(context.Request.Body);
			var body = await sr.ReadToEndAsync();
			requestMessage.Content = new StringContent(body, System.Text.Encoding.UTF8, context.Request.ContentType ?? "application/json");
		}

		var resp = await httpClient.SendAsync(requestMessage);
		context.Response.StatusCode = (int)resp.StatusCode;
		foreach (var header in resp.Headers)
		{
			if (!header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase))
				context.Response.Headers[header.Key] = header.Value.ToArray();
		}
		if (resp.Content != null)
		{
			foreach (var header in resp.Content.Headers)
			{
				if (!header.Key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
					context.Response.Headers[header.Key] = header.Value.ToArray();
			}
			var respContent = await resp.Content.ReadAsStringAsync();
			await context.Response.WriteAsync(respContent);
		}
	});
});

app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/api/auth"), proxyApp =>
{
	proxyApp.Run(async context =>
	{
		var forwardUri = new Uri("http://authservice:8080" + context.Request.Path + context.Request.QueryString);
		var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), forwardUri);

		foreach (var header in context.Request.Headers)
		{
			if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
			{
				requestMessage.Content ??= new StringContent(string.Empty);
				requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
			}
		}

		if (context.Request.ContentLength > 0)
		{
			using var sr = new StreamReader(context.Request.Body);
			var body = await sr.ReadToEndAsync();
			requestMessage.Content = new StringContent(body, System.Text.Encoding.UTF8, context.Request.ContentType ?? "application/json");
		}

		var resp = await httpClient.SendAsync(requestMessage);
		context.Response.StatusCode = (int)resp.StatusCode;
		foreach (var header in resp.Headers)
		{
			if (!header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase))
				context.Response.Headers[header.Key] = header.Value.ToArray();
		}
		if (resp.Content != null)
		{
			foreach (var header in resp.Content.Headers)
			{
				if (!header.Key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
					context.Response.Headers[header.Key] = header.Value.ToArray();
			}
			var respContent = await resp.Content.ReadAsStringAsync();
			await context.Response.WriteAsync(respContent);
		}
	});
});

// Default fallback
app.MapGet("/", () => "Gateway running");

app.Run();
