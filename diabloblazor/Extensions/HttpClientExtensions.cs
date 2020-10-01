using diabloblazor.Models;
using Microsoft.AspNetCore.Components.WebAssembly.Http;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace diabloblazor.Extensions
{
    public static class HttpClientExtensions
    {
        public static async Task<byte[]> GetWithProgressAsync(this HttpClient httpClient, string url, string message, int totalSize, int bufferSize, Action<Progress> onProgress)
        {
            var request = new HttpRequestMessage { Method = HttpMethod.Get, RequestUri = new Uri(url) };
            request.SetBrowserResponseStreamingEnabled(true);
            using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
            //using var response = await httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
            response.EnsureSuccessStatusCode();
            using var stream = await response.Content.ReadAsStreamAsync();
            var bytesRead = 0;
            var totalBytesRead = 0;
            var data = new byte[totalSize];
            do
            {
                var count = (totalBytesRead + bufferSize > totalSize) ? totalSize - totalBytesRead : bufferSize;
                bytesRead = await stream.ReadAsync(data, totalBytesRead, count);
                totalBytesRead += bytesRead;
                onProgress?.Invoke(new Progress { Message = message, BytesLoaded = totalBytesRead, Total = totalSize });
            }
            while (bytesRead != 0);
            return data;
        }

        public static async Task<bool> URLExists(this HttpClient httpClient, string url)
        {
            var request = new HttpRequestMessage { Method = HttpMethod.Head, RequestUri = new Uri(url) };
            request.SetBrowserResponseStreamingEnabled(true);
            using var result = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
            HttpStatusCode StatusCode = result.StatusCode;

            switch (StatusCode)
            {
                case HttpStatusCode.Accepted:
                    return true;
                case HttpStatusCode.OK:
                    return true;
            }

            return false;
        }

    }
}
