import Layout from './Layout';

function Home() {
  return (
    <Layout
      title="Home Page"
      description="HomePage E-commerce App"
      className="container-fluid"
    >
      <h2 className="mb-4">New Arrivals</h2>
      <h2 className="mb-4">Best Sellers</h2>
    </Layout>
  );
}

export default Home;
