import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';
import { UTApi } from 'uploadthing/server';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});

export async function DELETE(request: Request) {
    console.log('ABOUT TO DELETE FROM UPLOAD THING -------------------------------------');
    const url = new URL(request.url).searchParams.get('imageUrl');
    if (!url) {
        return new Response('URL parameter is missing', { status: 400 });
    }
    console.table(url);
    const newUrl = url.substring(url.lastIndexOf('/') + 1);
    const utapi = new UTApi();
    await utapi.deleteFiles(newUrl);

    return Response.json({ message: 'ok' });
}
