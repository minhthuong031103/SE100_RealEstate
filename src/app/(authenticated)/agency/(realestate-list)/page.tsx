import React from 'react';
import SearchBarAndCreate from '../(components)/SearchBarAndCreate';
import { getSession } from '@/lib/auth';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import ListItemRealEstate from "../(components)/ListItemRealEstate";


const page = async () => {
  const session = await getSession();
  const currentlyPlan = await getUserSubscriptionPlan();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });

  const products = await stripe.products.list();

  const subscribedPlan = products.data.find(
    (plan) => plan.id === currentlyPlan?.product
  );
  return (
    <div className="m-4">
      <SearchBarAndCreate
        subscribedPlan={subscribedPlan}
        user={user}
        currentlyPlan={currentlyPlan}
      />
      <ListItemRealEstate session={session} />
    </div>
  );
};

export default page;
