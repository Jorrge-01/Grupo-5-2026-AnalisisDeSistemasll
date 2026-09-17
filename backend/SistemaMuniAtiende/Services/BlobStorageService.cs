using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace SistemaMuniAtiende.Services
{
    public class BlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private const string ContenedorEvidencia = "evidencia-casos";

        public BlobStorageService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task<string> SubirArchivoAsync(IFormFile archivo, int casoId)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(ContenedorEvidencia);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var extension = Path.GetExtension(archivo.FileName);
            var nombreBlob = $"caso-{casoId}/{Guid.NewGuid()}{extension}";
            var blobClient = containerClient.GetBlobClient(nombreBlob);

            using var stream = archivo.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = archivo.ContentType });

            return blobClient.Uri.ToString();
        }
    }
}