using BIsleriumCW.Data;
using BIsleriumCW.Extensions;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using BIsleriumCW.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<BisleriumDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("BisleriumConnectionString")));

builder.Services.RegisterDependencies();
builder.Services.ConfigureMapping();
builder.Services.ConfigureLoggerService();
builder.Services.ConfigureRepositoryManager();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserAuthenticationRepository, UserAuthenticationRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.ConfigureSwagger();
builder.Services.AddSwaggerGen();

// Json Serializer
builder.Services.AddControllers().AddNewtonsoftJson(options =>
options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore).AddNewtonsoftJson(
    options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

//builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<BisleriumDbContext>();
//builder.Services.AddAuthorization();

var app = builder.Build();

// Enable CORS
app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();

app.UseStaticFiles();

app.MapControllers();

app.Run();
