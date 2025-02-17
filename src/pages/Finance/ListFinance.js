import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "@fontsource/aileron";
import "@fontsource/lato"
import '../../static/css/font.css';
import '../../static/css/DetailClient.css';
import AuthContext from '../../authorization/AuthContext'
import axios from "axios";


const ListFinance = () => {
  
  let {user} = useContext(AuthContext)
  const [id, setId] = useState("");
  const [contracts, setContracts] = useState([]);

  const [contract_products, setContractProducts] = useState([[]]);
  const [contract_product, setContractProduct] = useState([]);

  const [products, setProducts] = useState([[]]);
  const [product, setProduct] = useState([]);

  const [product_titles, setProductTitles] = useState([[]])
  const [product_title, setProductTitle] = useState([])

  const [product_bundles, setProductBundles] = useState([[]]);
  const [product_bundle, setProductBundle] = useState([]);

  const [company_names, setCompanyNames] = useState([])
  const [company_name, setCompanyName] = useState("")
  const [statuses, setStatuses] = useState([])

  const [unit_prices, setUnitPrices] = useState([])
  const [unit_price, setUnitPrice] = useState(0)
  
  var temp = 0

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    mergeData();
  }, [contracts]);

  const fetchData = async () => {
    const response = await axios.get(`http://localhost:8000/api/contract/`);
    const data = await response.data;
    setContracts(data);
  }

  const mergeData = async () => {
    console.log("PROPEN")
    console.log(contracts)
    for (let index = 0; index < contracts.length; index++) {
      setId(contracts[index].id)
      await fetchContractProductOfContract(id)
      setCompanyNames(company_names.concat(contracts[index].client.company_name))
      setStatuses(statuses.concat(contracts[index].status))
      setContractProducts(contract_products.concat(contract_product))
      setProducts(products.concat(product))

      for (const product in products) {
          setId(product.id)
          setProductTitle(product_title.concat(product.title))
          await fetchProductBundleOfProduct(id)
          setProductBundles(product_bundles.concat(product_bundle))
      }

      setProductTitles(product_titles.concat(product_title))
      setProductTitle([])

      for (const product_bundle in product_bundles[index]) {
          temp = temp + product_bundle.unit_price
          setUnitPrice(temp)
      }

      setUnitPrices(unit_prices.concat(unit_price))
      temp = 0
      setUnitPrice(0)
    }
  }

  const fetchContractProductOfContract = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/invoice/get-contract-product-of-contract/${id}/`)
    const data = await response.data
    setContractProduct(data)
    setProduct(data.products)
  }

  const fetchProductBundleOfProduct = async (id) => {
    const response = await axios.get(`http://localhost:8000/api/invoice/get-product-bundle-of-product/${id}/`)
    const data = await response.data
    setProductBundle(data)
  }

    return (
    <div>
        <table className="table is-striped is-fullwidth">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Company Name</th>
                    <th>Product Names</th>
                    <th>Status</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {contracts.map((contract, index) => (
                <tr key={contract.id}>
                    <td>{ index + 1 }</td>
                    <td>{ company_names[index] }</td>
                    <td>{ product_titles[index].join(', ') }</td>
                    <td>{ statuses[index] }</td>
                    <td>{ unit_prices[index] }</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
};

export default ListFinance;