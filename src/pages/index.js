import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Editor from '../components/Editor';
import Footer from '../components/Footer';

export default function Index() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <Layout pageTitle="EditAI">
        <Header />
        <Hero />
        <Editor />
      </Layout>
    </div>
  )
}
