export default function StayPage({ params }: { params: { slug: string } }) {
  return (
    <main style={{ padding: "40px", fontSize: "24px" }}>
      Stay: {params.slug}
    </main>
  );
}
