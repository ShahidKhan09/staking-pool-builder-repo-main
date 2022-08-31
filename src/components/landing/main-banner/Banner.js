import React, { useEffect, useState } from "react";
import Loader from "../../../hooks/loader";
import "./banner.scss";
import PoolCard from "./PoolCard";
import styled from "styled-components";
import { API_URL } from "../../../utils/ApiURL";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import DepositPool from "../../../hooks/dataFetchers/deposit";
import Web3 from "web3";
import RewardPool from "../../../hooks/dataFetchers/reward";
import TotalStaked from "../../../hooks/dataFetchers/totalStakedAmount";
import { tryCatch } from "eth/core";
import VPoolCard from "./VPoolCard";
const CardDiv = styled.div`
  &:hover {
    border-color: ${(props) => props.colorData?.accentColor}!important;
    /* filter: drop-shadow(2px 4px 6px ${(props) =>
    props.colorData?.accentColor}); */
  }
  :first-child h4 {
    color: ${(props) => props.colorData?.poolCardPrimeryTextColor}!important;
  }
  .btn-yellow {
    background-color: ${(props) => props.colorData?.accentColor}!important;
    color: ${(props) => props.colorData?.buttonTextColor}!important;
  }
  color: ${(props) => props.colorData?.poolCardPrimeryTextColor};
  background-color: ${(props) => props.colorData?.poolCardColor}!important;
  .text p {
    color: ${(props) => props.colorData?.poolCardSecondaryTextColor}!important;
  }
  .text h6 {
    color: ${(props) => props.colorData?.poolCardPrimeryTextColor}!important;
  }
  .input_btn h6 {
    color: ${(props) => props.colorData?.poolCardPrimeryTextColor} !important;
  }
  input {
    border-color: ${(props) => props.colorData?.accentColor}!important;
    color: ${(props) => props.colorData?.poolCardPrimeryTextColor}!important;
    &::placeholder {
      color: ${(props) =>
    props.colorData?.poolCardSecondaryTextColor}!important;
    }
  }
  //inner class second child p color red
  .inner p:nth-child(1) {
    color: ${(props) => props.colorData?.poolCardSecondaryTextColor}!important;
  }
  .right .box {
    padding: 6px 13px;
    /* background: ${(props) => props.colorData?.accentColor}!important; */
    color: ${(props) => props.colorData?.accentColor}!important;
    border: 1.5px solid ${(props) => props.colorData?.accentColor}!important;
    border-radius: 6px;
  }
`;
const Container = styled.section`
  .switch .custom-switch .custom-control-label::before {
    border-color: ${(props) => props.colorData?.accentColor};
  }
 
  .custom-switch .custom-control-label::after {
    background: ${(props) => props.colorData?.accentColor} !important;
  }
  .switch .custom-control-input:checked ~ .custom-control-label::before {
    border-color: ${(props) => props.colorData?.accentColor} !important;
  }
  input[type="checkbox" i]:focus-visible {
    outline-offset: unset !important;
  }
  .btn-yellow {
    background-color: ${(props) => props.colorData?.accentColor} !important;
    color: ${(props) => props.colorData?.buttonTextColor} !important;
  }
  .modal1 .modal .modal-body p span {
    color: ${(props) => props.colorData?.accentColor} !important;
  }
  .modal-content {
    background: ${(props) => props.colorData?.poolCardColor} !important;
    border-radius: 10px;
  }
  .modal-content {
  background: ${(props) => props.colorData?.poolCardColor} !important;
    border-radius: 10px;
}
  .modal-header {
    border-bottom-color: ${(props) => props.colorData?.accentColor} !important;
    background-color: ${(props) => props.colorData?.poolCardColor} !important;
  }
  .custom-switch .custom-control-input:checked ~ .custom-control-label::after {
    background-color: ${(props) => props.colorData?.accentColor} !important;
    /* -webkit-transform: translateX(0.75rem);
    transform: translateX(0.75rem); */
  }
  .custom-switch .custom-control-input:checked ~ .custom-control-label::after {
    background-color: #f6c325;
    /* -webkit-transform: translateX(0.75rem);
    transform: translateX(0.75rem); */
  }
  .custom-switch
    .custom-control-input:disabled:checked
    ~ .custom-control-label::before {
    background-color: rgb(255 255 255);
  }
  .another_card_section
    .bottom_cards
    .content-wrap
    .Cards_box
    .card_item
    .input_btn
    button:disabled {
    background: #b1b1b1 !important;
    cursor: not-allowed;
  }
  .modal1 .modal .modal-body .timer h6 span {
    color: ${(props) => props.colorData?.accentColor} !important;
  }
  .timerDivvv {
    color: ${(props) => props.colorData?.accentColor} !important;
  }
  .another_card_section .bottom_cards .content-wrap .Cards_box .card_item .input_btn input {
    background: #ffffff;
    border: 1.5px solid ${(props) => props.colorData?.accentColor}!important;
}
.outer .hdhdhd {
    background: ${(props) => props.colorData?.poolCardColor} !important;
}
.outer .inner p {
    color: ${(props) => props.colorData?.poolCardSecondaryTextColor} !important;
}
.outer .inner h6 {
    color: ${(props) => props.colorData?.poolCardPrimeryTextColor} !important;
}
`;

const Banner = ({ colorData }) => {
  const [option, setOption] = useState("1");
  const [allPools, setAllPools] = useState();
  const [load, setLoad] = useState(false);
  let [total, setTotal] = useState(0);
  let [totalUnClaimed, setTotalUnclaimed] = useState(0);
  const [stakedOnly, setStakedOnly] = useState(false);
  const { account } = useWeb3React();
  const { rewardThePool } = RewardPool();
  const [textMessage, settextMessage] = useState("Loading...");
  const [rewardValue, setRewardValue] = useState();
  // const { rewardThePool } = RewardPool();
  const { totalstakedA } = TotalStaked();
  const setStakedFunction = (e) => {
    setStakedOnly(e.target.checked);
  };

  const getAllPools = async () => {
    try {
      setLoad(true);
      const res = await axios.post(`${API_URL}pool/getAllPools`);
      setAllPools(res?.data?.allPools);
      // console.log("all pool of the ayar", res.data.allPools);
      setLoad(false);
    } catch (error) {
      console.log("error in getAllPools", error);
      setLoad(false);
    }
  }
  const getTotalUnClaimedReward = async () => {
    for (let i = 0; i < allPools?.length; i++) {
      try {
        const res = await rewardThePool(
          allPools[i]?.isStakingTokenBnb,
          allPools[i]?.isRewardTokenBnb,
          allPools[i]?.contractAddress
        );
        totalUnClaimed = parseInt(totalUnClaimed) + parseInt(res);
        console.log("before float first", res)
        console.log("total staked of all poolrrrrs", res)
        // console.log('total staked reward', total)
      } catch (error) {
        totalUnClaimed = parseInt(totalUnClaimed) + parseInt(0);
      }

    }
    setTotalUnclaimed(totalUnClaimed);
  }
  const getTotalStaked = async () => {
    for (let i = 0; i < allPools?.length; i++) {
      const res = await totalstakedA(
        allPools[i]?.isStakingTokenBnb,
        allPools[i]?.isRewardTokenBnb,
        allPools[i]?.contractAddress
      );
      total = total + parseInt(res);
      console.log("total staked yar starr ajdfasdfsdfasf", total, res);
      console.log("totalUnClaimed staked yar starr uyruey", res);
      // console.log('totalUnClaimed staked reward', totalUnClaimed)
    }
    setTotal(total);
  };

  useEffect(async () => {
    getAllPools();
  }, []);
  useEffect(() => {
    if (account) {
      getTotalStaked();
      getTotalUnClaimedReward();
    }
  }, [allPools, account]);

  return (
    <>
      {load && <Loader text={textMessage} />}
      <Container colorData={colorData}>
        <section
          className="banner"
          style={{ backgroundColor: `${colorData?.headerBackGroundColor}` }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-7 col-12 m-auto">
                <h1
                  className="text-capitalize"
                  style={{ color: `${colorData?.headerTitleTextColor}` }}
                >
                  {colorData?.headerTitleText
                    ? colorData?.headerTitleText
                    : ""}
                </h1>
                <p style={{ color: `${colorData?.headerDetailTextColor}` }}>
                  {colorData?.headerDetailText
                    ? colorData?.headerDetailText
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="outer">
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-xl-11 col-lg-11 col-md-12 col-12 m-auto">
                <div className="hdhdhd">
                  <div className="inner">
                    <p>Staked</p>
                    <h6>0</h6>
                  </div>
                  <span
                    style={{ backgroundColor: `${colorData?.accentColor}` }}
                  >
                    {/* <img
                    src="./assests\CardsImg\Line.png"
                    alt="img"
                    className="img-fluid"
                  /> */}
                  </span>
                  {/* {console.log("aaaaaaaaaa", total)} */}
                  <div className="inner">
                    <p>Unclaimed Reward</p>

                    <h6 className="text-truncate w-75">
                      {(totalUnClaimed / 10 ** 18).toFixed(3)}
                    </h6>
                  </div>
                  <span
                    style={{ backgroundColor: `${colorData?.accentColor}` }}
                  >
                    {/* <img
                    src="./assests\CardsImg\Line.png"
                    alt="img"
                    className="img-fluid"
                  /> */}
                  </span>
                  <div className="inner">
                    <p>Total Amount Staked</p>
                    <h6 className="text-truncate w-75">
                      {(total / 10 ** 18).toFixed(3)}{" "}
                    </h6>
                  </div>
                  <span
                    style={{ backgroundColor: `${colorData?.accentColor}` }}
                  >
                    {/* <img
                    src="./assests\CardsImg\Line.png"
                    alt="img"
                    className="img-fluid"
                  /> */}
                  </span>
                  <div className="inner">
                    <p>Total Amount Claimed</p>
                    <h6>0</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="another_card_section "
          style={{ backgroundColor: `${colorData?.bodyColor}` }}
        >
          <div className="row">
            <div className="col-xl-11 col-12 m-auto padd">
              <div className="multi_btn">
                <div className="option-wrap">
                  {/* <div className="group_btn" style={{ borderColor: `${colorData?.accentColor}` }}>
                  <div
                    className={`option ${option === "1" ? "selected" : ""}`}
                    onClick={(e) => setOption("1")}
                    style={{ backgroundColor: option === '1' && `${colorData?.accentColor}` }}
                  >
                    Live
                  </div>
                  <div
                    className={`option ${option === "2" ? "selected" : ""}`}
                    onClick={(e) => setOption("2")}
                    // style={{ backgroundColor: `${colorData?.accentColor}` }}
                    style={{ backgroundColor: option === '2' && `${colorData?.accentColor}` }}
                  >
                    Finished
                  </div>
                </div> */}
                  <div className="switch">
                    <div class="custom-control custom-switch">
                      <input
                        type="checkbox"
                        onChange={(e) => setStakedFunction(e)}
                        class="custom-control-input"
                        id="customSwitch1"
                      />
                      <label
                        class="custom-control-label checkCustom"
                        for="customSwitch1"
                      >
                        {stakedOnly ? 'Staked only' : 'All Pools'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="right">
                  {/* <div className="outline_dropdown">
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Sort By
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Hot</MenuItem>
                        <MenuItem value={20}>Cold</MenuItem>
                        <MenuItem value={30}>Warm</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div> */}
                  {/* <div className="input-field">
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "200px" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="outlined-basic"
                      label="Search Pool"
                      variant="outlined"
                    />
                  </Box>
                </div> */}
                </div>
              </div>
              <div className="bottom_cards">
                <div className="content-wrap">
                  {option === "1" && (
                    <div className="Cards_box">
                      <div className="row">
                        {allPools && allPools?.map((pool, index) => {
                          return (
                             !pool?.variable ?
                              <PoolCard
                                pool={pool}
                                colorData={colorData}
                                index={index}
                                stakedOnly={stakedOnly}
                                setLoad={setLoad}
                                settextMessage={settextMessage}
                              />
                              :
                              <VPoolCard
                                pool={pool}
                                colorData={colorData}
                                index={index}
                                stakedOnly={stakedOnly}
                                setLoad={setLoad}
                                settextMessage={settextMessage}
                              />
                        
                        );
                        })}
                      </div>
                    </div>
                  )}
                  {option === "2" && <div></div>}
                </div>
              </div>

              <div className="bottom_cards">
                <div className="content-wrap">
                  {option === "2" && (
                    <div className="Cards_box">
                      <CardDiv colorData={colorData} className="card_item">
                        <h4>Golden Pool</h4>
                        <div className="parent">
                          <div className="left">
                            <img
                              src="./assests\CardsImg\card6.svg"
                              alt="img"
                              className="img-fluid"
                            />
                            <div className="text">
                              <h5>Earn BUSD</h5>
                              <p>Stake BNB</p>
                            </div>
                          </div>
                          <div className="right">
                            <span className="box">44x</span>
                          </div>
                        </div>
                        <div className="inner_text">
                          <div className="inner">
                            <p>APR:</p>
                            <p>165.17%</p>
                          </div>
                          <div className="inner">
                            <p>Earn:</p>
                            <p>BUSD + Fees</p>
                          </div>
                          <div className="inner marg">
                            <p>Lock Period:</p>
                            <p>3 Month</p>
                          </div>
                        </div>
                        <div className="input_btn">
                          <h6>BUSD Earned</h6>
                          <input
                            className="px-2"
                            type="search"
                            placeholder="0.00"
                          />
                          <button className="btn-yellow" disabled>
                            Harvest
                          </button>
                        </div>
                        <div className="bottom_item">
                          <div className="text">
                            <h6>0.00</h6>
                            <p>BNB Staked</p>
                          </div>
                          <div className="btn_unstake">
                            <button className="btn-yellow">UNSTAKE</button>
                          </div>
                        </div>
                      </CardDiv>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="modal1">
          <div
            class="modal fade"
            id="basicModal2"
            tabindex="-1"
            role="dialog"
            aria-labelledby="basicModal"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel">
                    UnStake BNB-BUSD
                  </h4>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <img
                      src="./assests\CardsImg\modalclose.svg"
                      alt="img"
                      className="img-fluid"
                    />
                  </button>
                </div>
                <div class="modal-body">
                  <div className="text">
                    <p>No. of token you want to stake</p>
                  </div>
                  <div className="inner-btn">
                    <input type="number" placeholder="0.00" />
                    <button className="btn-yellow">Max</button>
                  </div>
                  <p>
                    Available Balance: <span>2.211 BNB</span>{" "}
                  </p>
                  <div className="timer">
                    <h6>
                      Remaining Time: <span>28d : 21h : 11m: 16s</span>
                    </h6>
                  </div>
                  <div className="bottom-btn">
                    <button className="btn-yellow">UnStake</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal1">
          <div
            class="modal fade"
            id={`basicModalussnstake${2}`}
            tabindex="-1"
            role="dialog"
            aria-labelledby="basicModal"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel">
                    UnStake BNB-BUSD
                  </h4>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <img
                      src="./assests\CardsImg\modalclose.svg"
                      alt="img"
                      className="img-fluid"
                    />
                  </button>
                </div>
                <div class="modal-body">
                  <div className="text">
                    <p>No. of token you want to unstake</p>
                  </div>
                  <div className="inner-btn">
                    <input type="number" placeholder="0.00" />
                    <button className="btn-yellow">Max</button>
                  </div>
                  <p>
                    Available Balance: <span>2.211 BNB</span>{" "}
                  </p>
                  <div className="timer">
                    <h6>
                      Remaining Time: <span>28d : 21h : 11m: 16s</span>
                    </h6>
                  </div>
                  <div className="bottom-btn">
                    <button className="btn-yellow">UnStake</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Banner;
