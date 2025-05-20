/* eslint-disable no-unused-vars */
import { Chart } from 'components/custom/Chart';
import { CustomSelect } from 'components/custom/CustomSelect';
import { DashboardCard } from 'components/custom/DashboardCard';
import { Page } from 'components/shared/Page';
import { Button, Card, Select } from 'components/ui';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import AuthService from 'services/auth.services';
import DashboardService from 'services/dashboard.services';
import KPISummaryList from './kpi-summary-list/list';
import TopGames from './top-game-list/list';
import TopPlayers from './top-player-list/list';

export default function Home() {
  const [cardResponse, setCardResponse] = useState({});
  const [cardError, setCardError] = useState(null);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [depositResponse, setDepositResponse] = useState(null);
  const [depositError, setDepositError] = useState(null);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [ggrResponse, setGGRResponse] = useState(null);
  const [ggrError, setGGRError] = useState(null);
  const [isGGRLoading, setIsGGRLoading] = useState(false);
  const [loggedInResponse, setLoggedInResponse] = useState(null);
  const [loggedInError, setLoggedInError] = useState(null);
  const [isLoggedInLoading, setIsLoggedInLoading] = useState(false);
  const [activePlayersResponse, setActivePlayersResponse] = useState(null);
  const [activePlayersError, setActivePlayersError] = useState(null);
  const [isActivePlayersLoading, setIsActivePlayersLoading] = useState(false);
  const [demographicResponse, setDemographicResponse] = useState(null);
  const [demographicError, setDemographicError] = useState(null);
  const [isDemographicLoading, setIsDemographicLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [selectedTimeRage, setSelectedTimeRange] = useState(1);
  const [casinoResponse, setCasinoResponse] = useState(null);
  const [casinoError, setCasinoError] = useState(null);
  const [isCasinoLoading, setIsCasinoLoading] = useState(false);
  const [redata, setRedata] = useState([]);

  const timeRangeOptions = [
    { value: 1, label: 'Last 30 days' },
    { value: 2, label: 'Last 90 Days' },
    { value: 3, label: 'Last 6 months' }
  ];

  const fetchDashboard = async () => {
    // try {
    //   setIsLoading(true);
    //   const result = await DashboardService.getDashboard();
    //   if (result.status === 200) {
    //     setResponse(result.response.data);
    //   } else {
    //     setError(result.error);
    //   }
    // } catch (error) {
    //   console.log('errr: ', error);
    // }
    // setIsLoading(false);
  };

  const fetchCards = async () => {
    try {
      setIsCardLoading(true);
      const result = await DashboardService.getCards();

      if (result.status === 200) {
        setCardResponse(result.response.data);
      } else {
        setCardError(result.error);
      }
    } catch (error) {
      console.log('errr fetchCards: ', error);
    }
    setIsCardLoading(false);
  };

  const fetchDepositStats = async () => {
    try {
      setIsDepositLoading(true);
      const result = await DashboardService.getDepositStats();

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;
        setRedata(data);

        setDepositResponse({
          name: t('deposit', { ns: 'glossary' }),
          type: 'line',
          height: 350,
          series: [
            {
              name: 'Deposit Amount',
              type: 'column',
              data: data?.deposits || []
            },
            {
              name: 'Deposit Count',
              type: 'line',
              data: data?.depositCount || []
            }
          ],
          options: {
            chart: {
              id: 'deposit',
              height: 350,
              type: 'line',
              stacked: false,
              toolbar: {
                show: true,
                export: {
                  svg: {
                    filename: 'deposit'
                  },
                  png: {
                    filename: 'deposit'
                  },
                  csv: {
                    filename: 'deposit'
                  }
                },
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  reset: true,

                  customIcons: [
                    {
                      icon: '<i class="fa fa-expand"></i>', // Custom fullscreen icon (FontAwesome)
                      click: function () {
                        toggleFullScreen();
                      },
                      title: 'Full Screen',
                      class: 'custom-icon'
                    }
                  ]
                }
              }
            },
            tooltip: {
              enabled: true,
              shared: true,
              followCursor: false,
              intersect: false,
              inverseOrder: false,
              onDatasetHover: {
                highlightDataSeries: false
              }
            },
            stroke: {
              width: [0, 3],
              curve: 'smooth'
            },
            // states: {
            //   hover: {
            //     filter: { type: 'none' }
            //   },
            //   active: {
            //     filter: { type: 'none' }
            //   }
            // },
            dataLabels: {
              enabled: false
            },
            // labels: data?.dates || [],
            yaxis: [
              {
                title: {
                  text: 'Deposit Amount'
                }
              },
              {
                opposite: true,
                title: {
                  text: 'Deposit Count'
                }
              }
            ],
            xaxis: {
              // type: 'category',
              stepSize: 10,
              tickPlacement: 'on',
              categories: data?.dates || []
            },
            markers: {
              size: 0
            }
          }
        });
        // setDepositResponse({
        //   type: "bar",
        //   options: {
        //     chart: {
        //       // type: 'bar',
        //       id: "basic-bar"
        //     },
        //     dataLabels: {
        //       enabled: true,
        //       enabledOnSeries: undefined,
        //       formatter: function (val, opts) {
        //         return val;
        //       },
        //       textAnchor: "top",
        //       distributed: false,
        //       offsetX: 0,
        //       offsetY: 0,
        //       style: {
        //         fontSize: "14px",
        //         fontFamily: "Helvetica, Arial, sans-serif",
        //         fontWeight: "bold",
        //         colors: undefined
        //       }
        //     },
        //     tooltip: {
        //       enabled: true,
        //       enabledOnSeries: undefined,
        //       shared: true,
        //       followCursor: false,
        //       intersect: false,
        //       inverseOrder: false,
        //       custom: undefined,
        //       fillSeriesColor: false,
        //       theme: false,
        //       style: {
        //         fontSize: "12px",
        //         fontFamily: undefined
        //       },
        //       onDatasetHover: {
        //         highlightDataSeries: false
        //       }
        //     },
        //     xaxis: {
        //       categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        //       tickPlacement: 'on',
        //     }
        //   },
        //   plotOptions: {
        //     bar: {
        //       columnWidth: "50%", // Adjust bar width for better hover
        //       barHeight: "100%", // Makes small bars easier to hover over
        //       borderRadius: 4, // Adds padding around bars for smoother interaction
        //       minBarHeight: 5, // Minimum height for bars
        //     }
        //   },
        //   series: [
        //     {
        //       name: "series-1",
        //       data: [2, 40, 45, 50, 49, 60, 70, 91]
        //     }
        //   ]
        // })
      } else {
        setDepositError(result.error);
      }
    } catch (error) {
      console.log('errr fetchDepositStats: ', error);
    }
    setIsDepositLoading(false);
  };

  const style = document.createElement('style');
  style.innerHTML = `
    .apexcharts-bar-area {
      pointer-events: all;
    }
    .apexcharts-bar-series .apexcharts-bar {
      stroke-width: 10px !important; /* Increase the hoverable area for small bars */
    }
  `;
  document.head.appendChild(style);

  const fetchCasinoStats = async () => {
    try {
      setIsCasinoLoading(true);
      const result = await DashboardService.getCasinoStats();

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;

        setCasinoResponse({
          name: t('casino', { ns: 'glossary' }),
          type: 'line',
          height: 350,
          series: [
            {
              name: 'Wagered Amount',
              type: 'column',
              data: data?.totalWagered || []
            },
            {
              name: 'Payout Amount',
              type: 'column',
              data: data?.totalPayout || []
            },
            {
              name: 'Wagered Count',
              type: 'area',
              data: data?.wageredCount || []
            },
            {
              name: 'Payout Count',
              type: 'line',
              data: data?.payoutCount || []
            }
          ],
          options: {
            chart: {
              id: 'casino',
              height: 350,
              type: 'line',
              toolbar: {
                export: {
                  svg: {
                    filename: 'casino'
                  },
                  png: {
                    filename: 'casino'
                  },
                  csv: {
                    filename: 'casino'
                  }
                }
              }
            },
            stroke: {
              width: [0, 0, 2, 3],
              curve: 'smooth'
            },
            fill: {
              opacity: [1, 1, 0.25, 1]
            },
            // title: {
            //   text: t("casino", { ns: "glossary" }),
            // },
            labels: data?.dates || [],
            yaxis: [
              {
                title: {
                  text: t('amount', { ns: 'glossary' })
                },
                seriesName: ['Wagered Amount', 'Payout Amount']
              },
              {
                title: {
                  text: t('count', { ns: 'glossary' })
                },
                seriesName: ['Wagered Count', 'Payout Count'],
                opposite: true
              }
            ]
          }
        });
      } else {
        setCasinoError(result.error);
      }
    } catch (error) {
      console.log('errr fetchCasinoStats: ', error);
    }
    setIsCasinoLoading(false);
  };

  const fetchGGRReport = async () => {
    try {
      setIsGGRLoading(true);
      const result = await DashboardService.getGGRReport();

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;

        setGGRResponse({
          name: t('ggr', { ns: 'glossary' }) + ' ' + t('report', { ns: 'glossary' }),
          type: 'bar',
          height: 350,
          series: [
            {
              name: 'Total Revenue',
              type: 'column',
              data: data?.totalRevenue || []
            },
            {
              name: 'Total Wagered',
              type: 'column',
              data: data?.totalWagered || []
            },
            {
              name: 'Total Payout',
              type: 'column',
              data: data?.totalPayout || []
            }
          ],
          options: {
            chart: {
              id: 'ggr',
              height: 350,
              type: 'bar',
              toolbar: {
                show: true,
                export: {
                  svg: {
                    filename: 'ggr'
                  },
                  png: {
                    filename: 'ggr'
                  },
                  csv: {
                    filename: 'ggr'
                  }
                }
              }
            },
            stroke: {
              show: true,
              colors: ['transparent']
            },
            xaxis: {
              tickPlacement: 'on'
            },
            tooltip: {
              enabled: true,
              enabledOnSeries: undefined,
              shared: true,
              followCursor: false,
              intersect: false,
              inverseOrder: false,
              onDatasetHover: {
                highlightDataSeries: false
              }
            },
            states: {
              hover: {
                filter: { type: 'none' }
              },
              active: {
                filter: { type: 'none' }
              }
            },
            dataLabels: {
              enabled: false
            },
            // title: {
            //   text:
            //     t("ggr", { ns: "glossary" }) +
            //     " " +
            //     t("report", { ns: "glossary" }),
            // },
            labels: data?.dates || []
          }
        });
      } else {
        setGGRError(result.error);
      }
    } catch (error) {
      console.log('errr fetchGGRReport: ', error);
    }
    setIsGGRLoading(false);
  };

  const fetchLoggedInPlayers = async () => {
    try {
      setIsLoggedInLoading(true);
      const result = await DashboardService.getLoggedInPlayers();

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;

        setLoggedInResponse({
          name: t('loggedIn', { ns: 'glossary' }) + ' ' + t('players', { ns: 'glossary' }),
          type: 'donut',
          width: 1000,
          series: data,
          options: {
            chart: {
              id: 'ggr',
              width: 1000,
              type: 'donut',
              toolbar: {
                export: {
                  svg: {
                    filename: 'ggr'
                  },
                  png: {
                    filename: 'ggr'
                  },
                  csv: {
                    filename: 'ggr'
                  }
                }
              }
            },
            // title: {
            //   text:
            //     t("loggedIn", { ns: "glossary" }) +
            //     " " +
            //     t("players", { ns: "glossary" }),
            // },
            labels: ['Logged In Players', 'Total Players'],
            plotOptions: {
              pie: {
                donut: {
                  size: '50%'
                }
              }
            },
            legend: {
              show: true,
              position: 'bottom'
            }
          }
        });
      } else {
        setLoggedInError(result.error);
      }
    } catch (error) {
      console.log('errr fetchLoggedInPlayers: ', error);
    }
    setIsLoggedInLoading(false);
  };

  const fetchActivePlayers = async () => {
    try {
      setIsActivePlayersLoading(true);
      const result = await DashboardService.getActivePlayers();

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;

        setActivePlayersResponse({
          name: t('active', { ns: 'glossary' }) + ' ' + t('players', { ns: 'glossary' }),
          type: 'bar',
          height: 350,
          series: [
            {
              name: 'User Count',
              type: 'bar',
              data: data?.userCount || []
            }
          ],
          options: {
            chart: {
              id: 'active',
              height: 350,
              type: 'bar',
              toolbar: {
                export: {
                  svg: {
                    filename: 'active-players'
                  },
                  png: {
                    filename: 'active-players'
                  },
                  csv: {
                    filename: 'active-players'
                  }
                }
              }
            },
            // title: {
            //   text:
            //     t("active", { ns: "glossary" }) +
            //     " " +
            //     t("players", { ns: "glossary" }),
            // },
            grid: {
              show: true,
              yaxis: {
                lines: {
                  show: false
                }
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '40%'
              }
            },
            xaxis: {
              categories: data?.dates || []
            },
            dataLabels: {
              enabled: false
            }
          }
        });
      } else {
        setActivePlayersError(result.error);
      }
    } catch (error) {
      console.log('errr fetchActivePlayers: ', error);
    }
    setIsActivePlayersLoading(false);
  };

  const fetchDemographicReport = async () => {
    try {
      setIsDemographicLoading(true);
      const data = {};

      data.timeRangeType = selectedTimeRage ? selectedTimeRage : 1;

      if (selectedCountry?.length) {
        // const contryIds = selectedCountry.map((s) => s.value);
        data.countries = selectedCountry;
      }

      console.log('getDemographicReport');

      const result = await DashboardService.getDemographicReport(data);

      if (result.status === 200) {
        console.log('result.response.data', result.response.data);

        const data = result.response.data;

        setDemographicResponse({
          name: t('demographic', { ns: 'glossary' }),
          type: 'line',
          height: 350,
          series: [
            {
              name: 'Deposit Amount',
              type: 'column',
              data: data?.totalDeposit || []
            },
            {
              name: 'Signup Count',
              type: 'line',
              data: data?.signupCount || []
            },
            {
              name: 'Unique Depositor',
              type: 'line',
              data: data?.uniqueDepositors || []
            }
          ],
          options: {
            chart: {
              id: 'demographic',
              height: 350,
              type: 'line',
              toolbar: {
                export: {
                  svg: {
                    filename: 'demographic'
                  },
                  png: {
                    filename: 'demographic'
                  },
                  csv: {
                    filename: 'demographic'
                  }
                }
              }
            },
            stroke: {
              width: [0, 3, 3],
              curve: 'smooth'
            },
            labels: data?.countries || [],
            yaxis: [
              {
                title: t('deposit', { ns: 'glossary' }) + ' ' + t('amount', { ns: 'glossary' })
              },
              {
                opposite: true
              }
            ]
          }
        });
      } else {
        setDemographicError(result.error);
      }
    } catch (error) {
      console.log('errr fetchDemographicReport: ', error);
    }
    setIsDemographicLoading(false);
  };

  const fetchCountryList = async () => {
    console.log('fetchCountryList');
    const result = await AuthService.getCountries();
    if (result.response && result?.response?.data?.length) {
      console.log('result: ', result);
      let countries = result?.response?.data.map((country) => {
        return { value: country.CountryID, label: country.CountryName };
      });
      console.log('countries :::::', countries);

      setCountryOptions(countries);
    }
  };

  const influencerOptions = countryOptions.map((country) => {
    return {
      value: country.CountryID,
      label: country.CountryName
    };
  });

  const handleCountryChange = (event) => {
    // setSelectedCountry(selected);
    setCountryError(event ? '' : 'Countries are required.');
    const options = Array.from(event.target.selectedOptions);
    const values = options.map((option) => {
      console.log(`Value: ${option.value}, Data Type: ${option.dataset.type}`);
      return option.value;
    });
    setSelectedCountry(values);
  };

  function toggleFullScreen() {
    const chartContainer = document.getElementById('chart-container');
    if (!document.fullscreenElement) {
      // If not in fullscreen, request fullscreen
      console.log('chartContainer.requestFullscreen: ', chartContainer);

      if (chartContainer.requestFullscreen) {
        chartContainer.requestFullscreen();
        // Disable the dark background color on the body
        document.body.style.background = 'transparent';
      } else if (chartContainer.mozRequestFullScreen) {
        // Firefox
        chartContainer.mozRequestFullScreen();
        // Disable the dark background color on the body
        document.body.style.background = 'transparent';
      } else if (chartContainer.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        chartContainer.webkitRequestFullscreen();
        // Disable the dark background color on the body
        document.body.style.background = 'transparent';
      } else if (chartContainer.msRequestFullscreen) {
        // IE/Edge
        chartContainer.msRequestFullscreen();
        // Disable the dark background color on the body
        document.body.style.background = 'transparent';
      }
    } else {
      // If in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
        // Restore the background color when exiting fullscreen
        document.body.style.background = '';
        document.body.style.overflow = ''; // Allow scrolling again when exiting fullscreen
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
        // Restore the background color when exiting fullscreen
        document.body.style.background = '';
        document.body.style.overflow = ''; // Allow scrolling again when exiting fullscreen
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
        // Restore the background color when exiting fullscreen
        document.body.style.background = '';
        document.body.style.overflow = ''; // Allow scrolling again when exiting fullscreen
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
        // Restore the background color when exiting fullscreen
        document.body.style.background = '';
        document.body.style.overflow = ''; // Allow scrolling again when exiting fullscreen
      }
    }
  }

  console.log('demographicResponse:', demographicResponse);

  useEffect(() => {
    fetchDashboard();
    fetchCards();
    fetchDepositStats();
    // fetchWithdrawStats();
    fetchGGRReport();
    fetchLoggedInPlayers();
    fetchActivePlayers();
    fetchDemographicReport();
    fetchCountryList();
    fetchCasinoStats();
  }, []);

  return (
    <Page title="Homepage">
      <div className="transition-content w-full px-[--margin-x] pt-5 lg:pt-6">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <DashboardCard
              label={`${t('total')}  ${t('deposits')}`}
              value="3,889,357,000"
              gradientFrom="from-info"
              gradientTo="to-info-darker"
              textColor="text-sky-100"
              maskShape="is-reuleaux-triangle"
            />
            <DashboardCard
              label={`${t('total')}  ${t('withdrawals')}`}
              value="855,129,000"
              gradientFrom="from-amber-400"
              gradientTo="to-orange-600"
              textColor="text-amber-50"
              maskShape="is-diamond"
            />
            <DashboardCard
              label={`${t('ggr')}`}
              value="3,667,357"
              gradientFrom="from-pink-500"
              gradientTo="to-rose-500"
              textColor="text-pink-100"
              maskShape="is-hexagon-2"
            />
            <DashboardCard
              label={`${t('net')} ${t('profit')}`}
              value="748,229"
              gradientFrom="from-amber-400"
              gradientTo="to-orange-600"
              textColor="text-amber-50"
              maskShape="is-reuleaux-triangle"
            />
            <DashboardCard
              label={`${t('today')} ${t('registrations')}`}
              value="6,333"
              gradientFrom="from-pink-500"
              gradientTo="to-rose-500"
              textColor="text-pink-100"
              maskShape="is-diamond"
            />
            <DashboardCard
              label={`${t('total')} ${t('players')}`}
              value="580,443"
              gradientFrom="from-info"
              gradientTo="to-info-darker"
              textColor="text-sky-100"
              maskShape="is-hexagon-2"
            />
            <DashboardCard
              label={`${t('total')} ${t('players')} ${t('balance')}`}
              value="580,443"
              gradientFrom="from-amber-400"
              gradientTo="to-orange-600"
              textColor="text-amber-50"
              maskShape="is-reuleaux-triangle"
            />
            <DashboardCard
              label={`${t('total')} ${t('providers')}`}
              value="5"
              gradientFrom="from-info"
              gradientTo="to-info-darker"
              textColor="text-sky-100"
              maskShape="is-diamond"
            />
          </div>
          <div className="-mx-2 flex flex-wrap pt-2">
            {!isDepositLoading && depositResponse && (
              <div className="mb-4 w-full px-2 md:w-1/2" id="chart-container">
                <Chart data={depositResponse} title={t('deposit')} />
              </div>
            )}
            {!isDepositLoading && !depositResponse && <div className="mb-4 w-full px-2 md:w-1/2" />}

            {/* Withdraw section - uncomment if needed */}
            {/* {!isWithdrawLoading && withdrawResponse && (
    <div className="w-full md:w-1/2 px-2 mb-4">
      <Chart data={withdrawResponse} title={"withdraw"} />
    </div>
  )}
  {!isWithdrawLoading && !withdrawResponse && (
    <div className="w-full md:w-1/2 px-2 mb-4" />
  )} */}

            {!isCasinoLoading && casinoResponse && (
              <div className="mb-4 w-full px-2 md:w-1/2">
                <Chart data={casinoResponse} title={t('casino')} />
              </div>
            )}
            {!isCasinoLoading && !casinoResponse && <div className="mb-4 w-full px-2 md:w-1/2" />}

            {!isGGRLoading && ggrResponse && (
              <div className="mb-4 w-full px-2">
                <Chart data={ggrResponse} title={`${t('ggr')} ${t('report')}`} />
              </div>
            )}

            {!isLoggedInLoading && loggedInResponse && (
              <div className="mb-4 w-full px-2 md:w-1/3">
                <Chart data={loggedInResponse} title={`${t('loggedIn')} ${t('players')}`} />
              </div>
            )}
            {!isActivePlayersLoading && activePlayersResponse && (
              <div className="mb-4 w-full px-2 md:w-2/3">
                <Chart data={activePlayersResponse} title={`${t('active')} ${t('players')}`} />
              </div>
            )}

            {!isDemographicLoading && demographicResponse && (
              <div className="mb-4 w-full px-2">
                <Card className="p-4">
                  <div className="-mx-2 mb-4 flex flex-wrap">
                    <div className="w-full px-2 sm:w-1/4" />
                    <div className="w-full px-2 sm:w-1/4">
                      <Select
                        defaultValue={selectedTimeRage}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        data={timeRangeOptions}
                      />
                    </div>
                    <div className="w-full px-2 sm:w-1/4">
                      <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        multiple
                        data={countryOptions}
                      />
                    </div>
                    <div className="w-full px-2 sm:w-1/6">
                      <Button
                        type="submit"
                        color="primary"
                        className="rounded px-4 py-2 font-semibold text-white"
                        onClick={fetchDemographicReport}>
                        Apply
                      </Button>
                    </div>
                  </div>
                  <div className="w-full">
                    <Chart data={demographicResponse} title={t('demographic')} />
                  </div>
                </Card>
              </div>
            )}

            <div className="mb-4 w-full px-2">
              <Card className="p-4">
                <KPISummaryList />
              </Card>
            </div>
            <div className="mb-4 w-full px-2">
              <Card className="p-4">
                <TopGames />
              </Card>
            </div>
            <div className="mb-4 w-full px-2">
              <Card className="p-4">
                <TopPlayers />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
