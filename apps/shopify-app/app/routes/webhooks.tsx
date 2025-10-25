import type { ActionFunctionArgs } from 'react-router';
import { authenticate } from '~/shopify.server';
import { prisma } from '~/db.server';

export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request,
  );

  console.log(`Received ${topic} webhook for ${shop}`);

  switch (topic) {
    case 'APP_UNINSTALLED':
      // Handle app uninstallation
      if (session) {
        await prisma.shop.update({
          where: { shopDomain: shop },
          data: { status: 'cancelled' },
        });
      }
      break;

    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }

  return new Response();
}

