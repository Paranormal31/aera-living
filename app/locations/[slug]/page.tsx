type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">Location Page</h1>

      <p className="mt-4">
        Slug received: <strong>{slug}</strong>
      </p>
    </section>
  );
}
