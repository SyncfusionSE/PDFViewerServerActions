using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.ResponseCompression;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var MyAllowSpecificOrigins = "MyPolicy";


// Add services to the container.

builder.Services.AddMemoryCache();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    // Use the default property (Pascal) casing
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
}); builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                        builder => {
                            builder.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                        });
});
builder.Services.Configure<GzipCompressionProviderOptions>(options => options.Level = System.IO.Compression.CompressionLevel.Optimal);
builder.Services.AddResponseCompression();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();
app.UseResponseCompression();

app.MapControllers();

app.Run();
