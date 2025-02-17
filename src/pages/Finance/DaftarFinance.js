import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractTable = () => {
  const [contracts, setContracts] = useState([]);
  const [contractDetail, setContractDetail] = useState([]);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/invoice/get-contract/');
      const contractsData = response.data;
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchContractProducts = async (contractId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/invoice/get-contract-product-of-contract/${contractId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contract products:', error);
      return [];
    }
  };

  const fetchProductBundles = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/invoice/get-product-bundle-of-product/${productId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching product bundles:', error);
      return [];
    }
  };

  const fetchProducts = async (contractProductId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/invoice/get-product-of-contract-product/${contractProductId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contract products:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      const contractDetail = [];

      for (const contract of contracts) {
        const contractProducts = await fetchContractProducts(contract.id);
        let totalPriceOfContract = 0;
        let productsName = [];
        
        for (const cp of contractProducts) {
          const productOfCp = await fetchProducts(cp.id);

          for (const product of productOfCp){
            productsName.push(product.title);
            const productBundle = await fetchProductBundles(product.id);
            for (const bundle of productBundle) {
              totalPriceOfContract += parseInt(bundle.unit_price, 10);
            }
          }
        }

        contractDetail.push({contractId: contract.id, company_name: contract.client.company_name, productsName: productsName, status: contract.status, total_price: totalPriceOfContract});
      }

      setContractDetail(contractDetail);
    };

    fetchContractData();
  }, [contracts]);

  // const click = async (e) => {
  //   e.preventDefault();

  //   console.log(contractDetail);
  // };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });


  return (
    <div className='content'>
      <section>
          <div className="container">
            <h1 style={{marginBottom:25}}>Report</h1>
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Product Title</th>
                  <th>Status</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody style={{alignItems:"center"}}>
                {contractDetail.map((contract) => {
                  return (
                    <tr key={contract.contractId}>
                      <td style={{textAlign:"center"}}>{contract.company_name}</td>
                      <td>
                      <ul>
                        {contract.productsName.map((productName) => (
                          <li key={productName}>{productName}</li>
                        ))}
                      </ul>
                      </td>
                      <td style={{textTransform: "capitalize", textAlign:"center"}}>{ contract.status.replace(/_/g, " ") }</td>
                      <td style={{textAlign:"center"}}>{formatter.format(contract.total_price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
        </section>
    </div>
  );
};

export default ContractTable;
