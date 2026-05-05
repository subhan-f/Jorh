import Layout from "./components/layout/Layout";
import ShortUrlForm from "./components/ShortUrlForm";

export default function App() {
  return (
    <Layout>
      {/* <div className="mb-10 max-w-xl text-center">
        <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight">
          Shorten any link, <span className="text-muted-foreground">instantly.</span>
        </h1>
        <p className="text-muted-foreground text-base">
          Paste your long URL below and get a clean, shareable short link in seconds.
        </p>
      </div> */}
      <ShortUrlForm />
    </Layout>
  );
}
