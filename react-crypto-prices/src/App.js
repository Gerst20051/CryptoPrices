import { Fragment, useEffect, useMemo, useState } from 'react';

import CryptoTable from './CryptoTable';
import Header from './Header';

function daysBetween(from, to) {
  const timeDifference = to.getTime() - from.getTime();
  return timeDifference / (1000 * 3600 * 24);
}

function transformCryptos(cryptos) {
  const totalMarketCap = cryptos.reduce((total, crypto) => total + crypto.market_cap, 0);
  return cryptos.map(crypto => ({
    ath_date: crypto.ath_date,
    current_price: `$${parseFloat(crypto.current_price.toFixed(6))}`,
    days_since_ath: Math.floor(daysBetween(new Date(crypto.ath_date), new Date())),
    high_24h: crypto.high_24h,
    image: crypto.image,
    image_symbol: {
      image: crypto.image,
      symbol: crypto.symbol.toUpperCase(),
    },
    low_24h: crypto.low_24h,
    market_cap: crypto.market_cap,
    market_cap_percentage: `${((crypto.market_cap / totalMarketCap) * 100).toFixed(2)}%`,
    market_cap_rank: crypto.market_cap_rank,
    name: crypto.name,
    price_change_24h: crypto.price_change_24h,
    price_change_percentage_24h: `${crypto.price_change_percentage_24h.toFixed(2)}%`,
    symbol: crypto.symbol.toUpperCase(),
    total_volume: crypto.total_volume,
  }));
}

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [lastFetchDate, setLastFetchDate] = useState(new Date());

  const columns = useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'market_cap_rank',
      },
      {
        Header: 'Symbol',
        accessor: 'image_symbol',
        Cell: ({ cell: { value } }) => (
          <span>
            <img alt="" src={value.image} width={13} />
            <span style={{ marginLeft: 10 }}><b>{value.symbol}</b></span>
          </span>
        ),
        sortType: (a, b, c) => a.values[c].symbol.localeCompare(b.values[c].symbol),
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Price',
        accessor: 'current_price',
      },
      {
        Header: '24h',
        accessor: 'price_change_percentage_24h',
      },
      {
        Header: 'Market Share',
        accessor: 'market_cap_percentage',
      },
      {
        Header: 'Days Since ATH',
        accessor: 'days_since_ath',
      },
    ],
    []
  );

  const fetchCryptos = async () => {
    const params = {
      order: 'market_cap_desc',
      page: '1',
      per_page: '100',
      sparkline: 'false',
      vs_currency: 'usd',
    };
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${new URLSearchParams(params)}`);
    const json = await response.json();
    setCryptos(transformCryptos(json));
  };

  useEffect(() => {
    fetchCryptos();
    setTimeout(() => setLastFetchDate(new Date()), 60E3);
  }, [lastFetchDate]);

  return (
    <Fragment>
      <Header text="Crypto Prices Dashboard" />
      <CryptoTable columns={columns} data={cryptos} />
    </Fragment>
  );
}

export default App;
