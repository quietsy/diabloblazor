﻿using diabloblazor.Services;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using TG.Blazor.IndexedDB;

namespace diabloblazor
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            builder.Services.AddSingleton(new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
            builder.Services.AddScoped<AppState>();
            builder.Services.AddScoped<Interop>();
            builder.Services.AddScoped<Worker>();
            builder.Services.AddSingleton<ExceptionHandler>();
            builder.Services.AddIndexedDB(db =>
            {
                db.DbName = "diablo_fs";
                db.Version = 1;
                db.Stores.Add(new StoreSchema
                {
                    Name = "kv",
                    PrimaryKey = new IndexSpec { KeyPath = "Name", Name = "Name", Auto = false }
                });
            });

            builder.RootComponents.Add<App>("app");

            await builder.Build().RunAsync();
        }
    }
}
