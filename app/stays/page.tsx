import Link from "next/link";
export default function StaysPage() {
  return (
    <main style={{ padding: "40px", fontSize: "24px" }}>
      <h1>Our Stays – Aera Living</h1>

      <ul style={{ marginTop: "20px" }}>
        <li>
          <Link href="/stays/aera-villa">Aera Villa, Dehradun</Link>
        </li>
      </ul>
    </main>
  );
}
