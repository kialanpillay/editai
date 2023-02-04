import Head from "next/head";

export default function Connect() {
  const handleSubmit = async () => {
    const response = await fetch("/api/terra/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: "1",
      }),
    });
    let auth = await response.json();
    if (response.status === 200) {
      window.open(auth.url, "_blank");
    }
  };

  return (
    <div>
      <Head>
        <title>Connect</title>
      </Head>

      <p>Connect Device</p>

      <button onClick={handleSubmit}>Connect</button>
    </div>
  );
}
