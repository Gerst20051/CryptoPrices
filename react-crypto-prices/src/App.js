import { green, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
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
    current_price: `$${parseFloat((crypto.current_price || 0).toFixed(6))}`,
    days_since_ath: Math.floor(daysBetween(new Date(crypto.ath_date), new Date())),
    high_24h: crypto.high_24h || 0,
    image: crypto.image,
    image_symbol: {
      image: crypto.image,
      symbol: crypto.symbol.toUpperCase(),
    },
    low_24h: crypto.low_24h || 0,
    market_cap: crypto.market_cap,
    market_cap_percentage: `${((crypto.market_cap / totalMarketCap) * 100).toFixed(2)}%`,
    market_cap_rank: crypto.market_cap_rank,
    name: crypto.name,
    price_change_24h: crypto.price_change_24h || 0,
    price_change_percentage_24h: `${(crypto.price_change_percentage_24h || 0).toFixed(2)}%`,
    symbol: crypto.symbol.toUpperCase(),
    total_volume: crypto.total_volume || 0,
  }));
}

const useStyles = makeStyles(theme => ({
  green: {
    color: green[500],
  },
  red: {
    color: red[500],
  },
}));

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [lastFetchDate, setLastFetchDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();

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
        sortType: (a, b, c) => a.values[c].toLowerCase().localeCompare(b.values[c].toLowerCase()),
      },
      {
        Header: 'Price',
        accessor: 'current_price',
      },
      {
        Header: '24h',
        accessor: 'price_change_percentage_24h',
        Cell: ({ cell: { value } }) => (
          <span className={value[0] === '-' ? classes.red : classes.green}>
            {value[0] === '-' ? value.slice(1) : value}
          </span>
        ),
        sortType: (a, b, c) => parseFloat(a.values[c]) - parseFloat(b.values[c]),
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
    [classes.green, classes.red]
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
      <Header text="Crypto Prices Dashboard" setSearchTerm={setSearchTerm} />
      <CryptoTable columns={columns} data={
        searchTerm
          ? cryptos.filter(crypto => (
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
              || crypto.symbol.includes(searchTerm.toUpperCase())
          ))
          : cryptos
      } />
    </Fragment>
  );
}

export default App;
