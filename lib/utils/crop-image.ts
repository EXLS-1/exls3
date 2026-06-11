// lib/utils/crop-image.ts
// Ce fichier contient des fonctions utilitaires pour le recadrage d'images, notamment la création d'une image à partir d'une URL et la génération d'une image recadrée à partir de coordonnées fournies. Ces fonctions sont utilisées pour manipuler les images dans l'application, en particulier lors du téléchargement ou de l'affichage d'images recadrées.
// Note: Ces fonctions utilisent les API du navigateur pour créer des éléments d'image et de canvas, et sont conçues pour être utilisées dans un environnement client (navigateur).
// Note: La fonction `getCroppedImg` retourne une promesse qui résout un Blob représentant l'image recadrée, ce qui peut être utilisé pour l'affichage ou le téléchargement de l'image recadrée.
// Note: La fonction `createImage` utilise l'attribut `crossOrigin` pour permettre le chargement d'images provenant de domaines différents, ce qui est nécessaire pour éviter les problèmes de sécurité lors du recadrage d'images provenant de sources externes.
// Note: Ces fonctions sont asynchrones et utilisent des promesses pour gérer les opérations de chargement d'images et de génération de blobs, ce qui permet une utilisation fluide dans des contextes où les images peuvent être volumineuses ou provenir de sources lentes.

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Génère une image recadrée à partir des coordonnées fournies.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Définir la taille du canvas selon le recadrage (1:1)
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.9);
  });
}