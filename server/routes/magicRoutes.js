const express = require("express")
const router = express.Router()
const axios = require("axios")
let requirements = {


};
// Hardcoded Magic Eden API key
const MAGIC_EDEN_API_KEY = 'abd05538-4a51-4b40-89ac-d9fad0649ee0';
let convertionBackup = "0.0"
const coinApi = [
	'52b6f479-de02-4b92-84be-f285670e7a6b',
	'2bc4f529-dd2d-4dbe-8916-a779c679c02b',

  "72023931-d329-442c-9807-2d676521f1a6",
  
]
const cAPi = {
	[Symbol.iterator]() {
	  let index = 0;
	  return {
		next() {
		  if (index >= coinApi.length) {
			index = 0;
		  }
		  return { value: coinApi[index++], done: false };
		},
	  };
	},
  };
  const iterator2 = cAPi[Symbol.iterator]();
  

async function getConversionFactor() {
    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
      start: "1",
      limit: "5",
      convert: "USD",
    };
    const headers = {
      Accepts: "application/json",
      "X-CMC_PRO_API_KEY": iterator2.next().value,
    };
  
    try {
      const response = await axios.get(url, { params, headers });
      convertionBackup = response.data.data[0].quote.USD.price / 100_000_000;
      return response.data.data[0].quote.USD.price / 100_000_000;
    } catch (error) {
      console.error("Error fetching conversion factor:", error.message);
      return convertionBackup;
    }
  }
// Route to get Rune collection stats and convert to Excel
// async function getMagicEdenData(tick, prevData, value, firsttime) {
//   const url = 'https://api-mainnet.magiceden.dev/v2/ord/btc/runes/collection_stats/search';
//   const headers = {
//     'Authorization': `Bearer ${MAGIC_EDEN_API_KEY}`,
//   };
//   const params = {
//     window: '1d',
//     limit: 200,
//     sort: 'volume',
//     direction: 'desc',
//     allCollections: true,
//   };

//   try {
//     const response = await axios.get(url, { headers, params });
//     const data = response.data.runes.find(rune => rune.etching.runeTicker === tick);

//     if (!data) {
//       console.error(`No data found for tick: ${tick}`);
//       return null;
//     }

//     if (
//       !prevData[tick] ||
//       prevData[tick][0] !== data.runeNumber ||
//       prevData[tick][1] !== data.unitPriceSats
//     ) {
//       prevData[tick] = [data.runeNumber, data.unitPriceSats];

// 	  const conversionFactor = await getConversionFactor();

//       if (firsttime === 'true') {
//         return {
//           tick: data.etching.runeTicker,
//           runeName: data.etching.runeName,
//           divisibility: data.divisibility,
//           unitPrice: data.unitPriceSats * conversionFactor,
//           marketCap: data.marketCap,
//         };
//       }
// // console.log(value)
//       if (value && (data.unitPriceSats * conversionFactor) < parseFloat(value.slice(1))) {
//         return {
//           type: 'valuebadi',
//           tick: data.etching.runeTicker,
//           unitPrice: data.unitPriceSats * conversionFactor,
//           marketCap: data.marketCap,
//         };
//       } else {
//         return {
//           tick: data.etching.runeTicker,
//           runeName: data.etching.runeName,
//           divisibility: data.divisibility,
//           unitPrice: data.unitPriceSats * conversionFactor,
//           marketCap: data.marketCap,
//         };
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching Magic Eden data:', error);
//     return null;
//   }
// }



async function getMagicEdenData(tick, prevData, value, firsttime) {
  const statsUrl = 'https://api-mainnet.magiceden.dev/v2/ord/btc/runes/collection_stats/search';
  const ordersUrl = `https://api-mainnet.magiceden.dev/v2/ord/btc/runes/orders/${tick}`;
  const headers = {
    'Authorization': `Bearer ${MAGIC_EDEN_API_KEY}`,
  };
  const statsParams = {
    window: '1d',
    limit: 200,
    sort: 'volume',
    direction: 'desc',
    allCollections: true,
  };
  const ordersParams = {
    side: 'sell', // Fetch sell orders
    sort: 'unitPriceAsc', // Sort by ascending unit price
    offset: 0, // Starting from the first page
    includePending: false, // Exclude pending orders
  };

  try {
    // Fetch stats for the collection
    const statsResponse = await axios.get(statsUrl, { headers, params: statsParams });
    const statsData = statsResponse.data.runes.find(rune => rune.etching.runeTicker === tick);

    if (!statsData) {
      console.error(`No stats data found for tick: ${tick}`);
      return null;
    }

    // Fetch orders for the specific rune
    const ordersResponse = await axios.get(ordersUrl, { headers, params: ordersParams });
    const ordersData = ordersResponse.data;

    if (!ordersData || ordersData.length === 0) {
      console.error(`No orders found for tick: ${tick}`);
      return null;
    }

    // Extract and calculate data
    if (
      !prevData[tick] ||
      prevData[tick][0] !== statsData.runeNumber ||
      prevData[tick][1] !== statsData.unitPriceSats
    ) {
      prevData[tick] = [statsData.runeNumber, statsData.unitPriceSats];
      const conversionFactor = await getConversionFactor();

     
      const result = {
       runes:ordersData,
       conversionFactor:conversionFactor
      };

      if (firsttime === 'true') {
        return result;
      }

      if (value && (statsData.unitPriceSats * conversionFactor) < parseFloat(value.slice(1))) {
      console.log("enter")
        return {
          type: 'valuebadi',
          ...result,
        };
      } else {
        return result;
      }
    }
  } catch (error) {
    console.error('Error fetching Magic Eden data:', error);
    return null;
  }
}

router.get('/magic-eden/:firstt', async (req, res) => {
  const prevData = {};
  const results = [];
  const firsttValue = "false";
  // const firsttValue = req.params.firstt;


  // Replace `requirements` with your logic for tickers and values
  for (let [tick, value] of Object.entries(requirements)) {
	// console.log(tick ,value)
    const result = await getMagicEdenData(tick, prevData, value, firsttValue);
    if (result) {
      results.push(result);
    }
  }

  res.json(results);
});

  // API Endpoints
  router.get("/requirements", (req, res) => {
    res.json(requirements);
  });
  
  router.post("/requirements", (req, res) => {
     try {
      const { key, value } = req.body;
    
      // Check if tick_name is provided, even if it's null
      if (typeof key === "undefined") {
        return res.status(400).json({ error: "tick_name is required" });
      }
    
      // Set the value to null if not provided
      requirements[key] = value ?? null;
    
      return res.status(200).json({
        message: "Requirement added/updated successfully",
        requirements,
      });
     } catch (error) {
      console.log(error)
      return res.status(500).json({
          message:"Inernal erorr"
      })
      
     }
    });
  
  
    router.delete("/requirements/:key", (req, res) => {
      try {
        const { key } = req.params;
    
        // Check if the requirement exists
        if (!requirements.hasOwnProperty(key)) {
          return res.status(404).json({ error: "Requirement not found" });
        }
    
        // Delete the requirement
        delete requirements[key];
    
        return res.status(200).json({
          message: "Requirement deleted successfully",
          requirements,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Internal error",
        });
      }
    });

module.exports = router;
