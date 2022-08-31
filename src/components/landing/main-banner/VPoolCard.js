import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
import useEthBalance from "../../../hooks/dataFetcher";
import Loader from "../../../hooks/loader";
import Countdown from "react-countdown";
import "./banner.scss";
import Web3 from "web3";
import styled from "styled-components";
import { API_URL } from "../../../utils/ApiURL";
import axios from "axios";
import DepositPool from "../../../hooks/dataFetchers/deposit";
import UserInfoPool from "../../../hooks/dataFetchers/userInfo";
import { map } from "lodash";
import { useWeb3React } from "@web3-react/core";
import ApprovePool from "../../../hooks/dataSenders/poolApprove";
import UnStakePool from "../../../hooks/dataSenders/vunstakePool";
import earlyUnstake from "../../../hooks/dataSenders/earlyUnstake";
import harvestPool from "../../../hooks/dataSenders/harvestPool";
import ClaimRewardos from "../../../hooks/dataSenders/claimRewardo";
import StakePool from "../../../hooks/dataSenders/vstakepool";
import CheckBalance from "../../../hooks/dataFetchers/balanceOf";
import CheckAllowance from "../../../hooks/dataFetchers/allowance";
import RewardPool from "../../../hooks/dataFetchers/reward";
import RewardPool2 from "../../../hooks/dataFetchers/variableReward";
import LockPeriodMethod from "../../../hooks/dataFetchers/vlockPeriod";
import { toast } from "react-toastify";
import useWeb3 from "../../../hooks/useWeb3";
import Timer from "react-compound-timer/build";
import { ClimbingBoxLoader } from "react-spinners";
import TimerCustom from "./TimerCustom";
import { type } from "eth/core";

const CardDiv = styled.div`
  &:hover {
    border-color: ${(props) => props.colorData?.accentColor}!important;
    /* filter: drop-shadow(2px 4px 6px ${(props) =>
    props.colorData?.accentColor}); */
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
.another_card_section .bottom_cards .content-wrap .Cards_box .card_item h4 {
  color: ${(props) => props.colorData?.poolCardPrimeryTextColor}!important;
}
.bottom-btn h5{
  color: ${(props) => props.colorData?.poolCardSecondaryTextColor}!important;
  span{
    color: ${(props) => props.colorData?.accentColor}!important;
  }
}
.another_card_section .bottom_cards .content-wrap .Cards_box .card_item .input_btn input {
    background: #ffffff;
    border: 1.5px solid ${(props) => props.colorData?.accentColor}!important;
}

`

const VPoolCard = ({
  pool,
  colorData,
  index,
  stakedOnly,
  setLoad,
  settextMessage,
}) => {
  const [age, setAge] = React.useState("");
  const [balance1, setBalance] = useState();
  const [stakeVal, setStakeVal] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakeRes, setStakeRes] = useState();
  const [userInfoValue, setUserInfoValue] = useState()
  const { rewardThePool } = RewardPool();
  const { rewardThePool2 } = RewardPool2();
  const web3 = useWeb3();
  let ethBalance = useEthBalance();
  const { lockperiodThePool } = LockPeriodMethod();
  const { approveThePool } = ApprovePool();
  const { unstakeThePool } = UnStakePool();
  const { earlyunstakeThePool } = earlyUnstake();
  const { harvestThePool } = harvestPool();
  const { ClaimThePoolReward } = ClaimRewardos();
  const { stakeThePool } = StakePool();
  const { balanceOfToken } = CheckBalance();
  const { allowanceOfToken } = CheckAllowance();
  const { depositThePool } = DepositPool();
  const { userInfoo } = UserInfoPool();
  const [depositValue, setDepositValue] = useState();
  const [rewardValue, setRewardValue] = useState();
  const [rewardValue2, setRewardValue2] = useState();
  const [lockPeriodValue, setLockPeriodValue] = useState();
  const [time, setTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(0);
  const { account } = useWeb3React();
  const [unstakepoolStatus, setUnstakePoolStatus] = useState()
  const [earlyunstakepoolStatus, setEarlyUnstakePoolStatus] = useState()
  const [claimRewardStatus, setClaimRewardStatus] = useState()
  const [harvestPoolStatus, setHarvestPoolStatus] = useState()
  useEffect(() => {
    setTime(Date.now() + 100000);
  }, []);
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const modalAndBalance = async (pool, id) => {
    if (account) {
      window.$(`#basicModal${id}`).modal("show");
    } else {
      toast.error("Please connect to Wallet");
    }
  };
  const action = {
    type: 'pool/stake',
    payload: '1bnb'
  }
  const checkTokenBalance = async () => {
    if (!pool?.isStakingTokenBnb) {
      try {
        const res = await balanceOfToken(pool?.stakingTokenAddress);
        setTokenBalance(Web3?.utils?.fromWei(res, "ether"));
        if (Web3?.utils?.fromWei(res, "ether") <= 0) {
          setTokenBalance("Your Balance is insufficent!");
          setTokenBalance(0);
        }
      } catch (error) {
        setTokenBalance(0);
        setTokenBalance("This pool  staking token Address is Invalid");
      }
    } else {
    }
  };
  const StakingP = async (
    isStakingTokenBnb,
    isRewardTokenBnb,
    stakingTokenAddress,
    contractAddress,
    stakeVal2,
    lockperiod,
    id
  ) => {
    if (stakeVal === 0) {
      toast.error("Please enter stake value");
    } else {
      if (isStakingTokenBnb == false) {
        setLoad(true);
        settextMessage("Staking...");
        try {
          const allowanceRes = await allowanceOfToken(
            stakingTokenAddress,
            contractAddress
          );
          if (Web3?.utils?.fromWei(allowanceRes, "ether")) {
            if (stakeVal2 <= Web3?.utils?.fromWei(allowanceRes, "ether")) {
              try {
                setLoad(true);
                settextMessage("Staking...");
                console.log("staking");
                const res = await stakeThePool(
                  isStakingTokenBnb,
                  isRewardTokenBnb,
                  contractAddress,
                  stakeVal2,
                  lockperiod
                );
                console.log("res of staking", res);
                setStakeRes(res);
                window.$(`#basicModal${id}`).modal("hide");
                toast.success("Staking Successful");
                setLoad(false);
              } catch (error) {
                toast.error(error.message.slice(22, 90));
                window.$(`#basicModal${id}`).modal("hide");
                console.log("Staking Failed", error);
                setLoad(false);
              }
            } else {
              try {
                setLoad(true);
                settextMessage("Approving...");
                const res = await approveThePool(
                  stakingTokenAddress,
                  contractAddress,
                  stakeVal2
                );
                toast.success("Approval Successful");
                toast.success("Now Staking");
                console.log("res of the ui", res);
                if (res) {
                  try {
                    setLoad(true);
                    settextMessage("Staking...");
                    console.log("staking");
                    const res = await stakeThePool(
                      isStakingTokenBnb,
                      isRewardTokenBnb,
                      contractAddress,
                      stakeVal2,
                      lockperiod
                    );
                    window.$(`#basicModal${id}`).modal("hide");
                    console.log("res of staking", res);
                    setStakeRes(res);
                    setLoad(false);
                    toast.success("Staking Successful");
                  } catch (error) {
                    setLoad(false);
                    window.$(`#basicModal${id}`).modal("hide");
                    settextMessage("Loading...");
                    toast.error(error.message.slice(22, 90));
                    console.log("Staking Failed", error);
                  }
                }
              } catch (error) {
                toast.error(error.message.slice(22, 90));
                window.$(`#basicModal${id}`).modal("hide");
                console.log("Staking Failed", error);
                setLoad(false);
              }
            }
          } else {
            toast.error("every thing is wrong");
            setLoad(false);
            settextMessage("Loading...");
          }
        } catch (error) {
          console.log("Approval Failed", error);
          settextMessage("Loading...");
        }
      } else {
        try {
          setLoad(true);
          settextMessage("Staking...");
          console.log("staking");
          window.$(`#basicModal${id}`).modal("hide");
          const res = await stakeThePool(
            isStakingTokenBnb,
            isRewardTokenBnb,
            contractAddress,
            stakeVal2,
            lockperiod
          );
          console.log("res of staking", res);
          setStakeRes(res)
          toast.success("Staking Successful");
          setLoad(false);
        } catch (error) {
          window.$(`#basicModal${id}`).modal("hide");
          settextMessage("Staking...");
          setLoad(false);
          toast.error(error.message.slice(22, 90));
          console.log("Staking Failed", error);
        }
      }
    }
  };
  const UnstakethePoolss = async (
    isStakingTokenBnb,
    isRewardTokenBnb,
    contractAddress,
    id,
  ) => {
    if (account) {
      try {
        setLoad(true);
        settextMessage("Unstaking...");
        window.$(`#basicModal${id}`).modal("hide");
        window.$(`#basicModalunstake${id}`).modal("hide");
        const res = await unstakeThePool(
          isStakingTokenBnb,
          isRewardTokenBnb,
          contractAddress,
        );
        setUnstakePoolStatus(res)
        setLoad(false);
        toast.success("Unstaked Successfully");
      } catch (error) {
        window.$(`#basicModalunstake${id}`).modal("hide");
        toast.error(error.message.slice(22, 90));
        setLoad("Loading...");
        setLoad(false);
      }
    } else {
      toast.error("Please connect to Wallet");
    }
  };
  const EarlyUnstakethePoolss = async (
    isStakingTokenBnb,
    isRewardTokenBnb,
    contractAddress,
    id
  ) => {
    if (account) {
      try {
        toast.info(
          `${pool?.feeforPrematureUnstaking}% unstaking fee if withdrawn within 72h ${pool?.lockPeriod / 60}...`
        );
        setLoad(true);
        settextMessage(
          `${pool?.feeforPrematureUnstaking}% unstaking fee if withdrawn within ${pool?.lockPeriod / 60} Minutes...`
        );
        window.$(`#basicModal${id}`).modal("hide");
        window.$(`#basicModalunstake${id}`).modal("hide");
        const res = await earlyunstakeThePool(
          isStakingTokenBnb,
          isRewardTokenBnb,
          contractAddress
        );
        setEarlyUnstakePoolStatus(res)
        setLoad(false);
        toast.success("Unstaked Successfully");
      } catch (error) {
        window.$(`#basicModalunstake${id}`).modal("hide");
        toast.error(error.message.slice(22, 90));
        setLoad("Loading...");
        setLoad(false);
      }
    } else {
      toast.error("Please connect to Wallet");
    }
  };
  const ClaimRewardB = async (
    isStakingTokenBnb,
    isRewardTokenBnb,
    contractAddress
  ) => {
    if (account) {
      try {
        setLoad(true);
        settextMessage("Claiming...");
        const res = await ClaimThePoolReward(
          isStakingTokenBnb,
          isRewardTokenBnb,
          contractAddress
        );
        console.log("res of the ui", res);
        if (res) {
          setClaimRewardStatus(res)
          setLoad(false);
          toast.success("Reward Amount Claimed!");
        }
      } catch (error) {
        setLoad(false);
        toast.error("Reward Amount Claim Failed!");
      }
    } else {
      toast.error("Please Connect to Wallet first");
    }
  };
  const HarveststhePoolsss = async (
    isStakingTokenBnb,
    isRewardTokenBnb,
    contractAddress
  ) => {
    if (account) {
      try {
        setLoad(true);
        settextMessage("Reinvesting...");
        const res = await harvestThePool(
          isStakingTokenBnb,
          isRewardTokenBnb,
          contractAddress
        );
        console.log("res of the ui", res);
        if (res) {
          setHarvestPoolStatus(res)
          setLoad(false);
          toast.success("Reward Amount Reinvested!");
        }
      } catch (error) {
        setLoad(false);
        toast.error("Reward Amount Reinvest Failed!");
      }
    } else {
      toast.error("Please Connect to Wallet first");
    }
  };
  const getstakeVal = (e) => {
    setStakeVal(e.target.value);
  };
  const nftDeposit = async () => {
    try {
      setLoad(true);
      const res = await depositThePool(
        pool?.isStakingTokenBnb,
        pool?.isRewardTokenBnb,
        pool?.contractAddress
      );

      setDepositValue(res);
      console.log('console of the nft deposit', res)
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  const userInfoOfThePool = async () => {
    try {
      setLoad(true);
      const res = await userInfoo(
        pool?.isStakingTokenBnb,
        pool?.isRewardTokenBnb,
        pool?.contractAddress
      );

      setUserInfoValue(res);
      console.log('console of the nft userInfo', res)
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  const nftReward = async () => {
    try {
      setLoad(true);
      const resReward = await rewardThePool(
        pool?.isStakingTokenBnb,
        pool?.isRewardTokenBnb,
        pool?.contractAddress
      );
      console.log("Reward of the pool is rgs =====>", resReward);
      setRewardValue(resReward);
      setLoad(false);
    } catch (error) {
      setRewardValue("0");
      console.log("Reward of the pool is rgs =====>", error);
      setLoad(false);
    }
  };
  const VariablenftReward = async () => {
    try {
      setLoad(true);
      const resReward = await rewardThePool2(
        pool?.isStakingTokenBnb,
        pool?.isRewardTokenBnb,
        pool?.contractAddress
      );
      console.log("Reward of the pool is rgs22 =====>", resReward);
      setRewardValue2(resReward);
      setLoad(false);
    } catch (error) {
      setRewardValue2("0");
      console.log("Reward of the pool is rgs =====>", error);
      setLoad(false);
    }
  };
  const lockPeriodCheck = async () => {
    try {
      const resPeriod = await lockperiodThePool(
        pool?.isStakingTokenBnb,
        pool?.isRewardTokenBnb,
        pool?.contractAddress
      );
      // console.log('console of the deposit time', resPeriod)
      setLockPeriodValue(resPeriod);
    } catch (error) {
      console.log("Reward of the pool is rgs =====>", error);
      setLoad(false);
    }
  };
  const checkBalance = () => {
    const balance = (ethBalance.toNumber() / 10 ** 18).toFixed(3);
    setBalance(balance);
  };

  const calculateTime = () => {
    console.log(
      "console of the deposit time",
      userInfoValue?.endtime,
      lockPeriodValue
    );
    console.log(
      "console of the deposit time",
      parseInt(userInfoValue?.endtime) + parseInt(lockPeriodValue)
    );
    console.log("console of the deposit time", Date.now() / 1000);
    const unstaketime =
      parseInt(userInfoValue?.endtime) +
      parseInt(lockPeriodValue) -
      Date.now() / 1000;
    // if (unstaketime > 0) {()
    console.log('tidi 58df jd', unstaketime / 60)
    setTimeLeft(unstaketime);
    // } else {

    // }
    // console.log(
    //   "console of the left time is xx",
    //   parseInt(userInfoValue?.endtime) +
    //   parseInt(lockPeriodValue) -
    //   Date.now() / 1000
    // );
  };
  useEffect(() => {
    calculateTime();
  }, [depositValue,stakeRes,userInfoValue, lockPeriodValue]);
  useEffect(() => {
    checkBalance();
  }, [account, (ethBalance.toNumber() / 10 ** 18).toFixed(3)]);
  useEffect(() => {
    nftDeposit();
    nftReward();
    VariablenftReward();
    userInfoOfThePool()
    lockPeriodCheck();
    checkTokenBalance();
  }, [account, rewardValue, stakeRes, unstakepoolStatus, earlyunstakepoolStatus, claimRewardStatus, harvestPoolStatus]);
  return (
    <>
      {(stakedOnly ? depositValue?.stakedAmount > 0 : true) && (
        <div className="col-xl-4 col-lg-4 col-md-6 col-12">
          <CardDiv
            pool={pool}
            colorData={colorData}
            className="card_item active"
          >
            <h4>{pool?.poolName || "Golden Pool"}</h4>
            <div className="parent">
              <div className="left">
                <ul className="list-inline eartnBusd">
                  <li className="list-inline-item ">
                    <img src={pool?.rewardTokenLogo} alt="img" className="" />
                  </li>
                  <li className="list-inline-item">
                    <img src={pool?.stakingTokenLogo} alt="img" className="" />
                  </li>
                </ul>

                <div className="text textIcons">
                  <h5>Earn {pool?.rewardTokenName || "Bnb"}</h5>
                  <p className="textSecondary">
                    Stake {pool?.stakingTokenSymbol || "Bnb"}
                  </p>
                  <a href={`https://testnet.bscscan.com/address/${pool?.contractAddress}#code`} className="contractLin" target="_blank" style={{ color: `${colorData?.accentColor}` }}>View contract on explorer</a>
                </div>
              </div>
              {/* <div className="right">
                                  <span className="box">44x</span>
                                </div> */}
            </div>
            <div className="inner_text">
              <div className="inner">
                <p className="textSecondary">Reward:</p>
                <p>{pool?.rewardTokenName || "--"}</p>
              </div>
              <div className="inner">
                <p className="textSecondary">Earn:</p>
                <p>{pool?.rewardTokenSymbol || "Bnb"} + Fees</p>
              </div>
              <div className="inner marg">
                <p className="textSecondary">Lock Period:</p>
                <p>{(pool?.lockPeriod / 60) || "0"} Minutes</p>
              </div>
            </div>
            <div className="input_btn">
              <h6> {pool?.rewardTokenSymbol || "Bnb"} Earned</h6>
              {/* <input value={`${rewardValue?.slice(0, 6)}...` || 0} className="px-2" disabled type="search" placeholder="0.00" /> */}
              <input
                value={
                  userInfoValue
                    ? ` ${Web3?.utils?.fromWei(userInfoValue?.rewardDebt, "ether").slice(0, 7)}...`
                    : 0
                }
                className="px-2"
                disabled
                type="text"
                placeholder="0.00"
              />
              {/* {pool?.autoCompound || <>
              <button
                disabled={depositValue?.stakedAmount <= 0 ? true : false}
                onClick={() =>
                  ClaimRewardB(
                    pool?.isStakingTokenBnb,
                    pool?.isRewardTokenBnb,
                    pool?.contractAddress
                  )
                }
                className="btn-yellow ClaimButton"
              >
                Claim
              </button>
              <button
                disabled={depositValue?.stakedAmount <= 0 ? true : false}
                onClick={() =>
                  HarveststhePoolsss(
                    pool?.isStakingTokenBnb,
                    pool?.isRewardTokenBnb,
                    pool?.contractAddress
                  )
                }
                className="btn-yellow"
              >
                Reinvest
              </button>
              </>} */}
              {/* <button
                disabled={depositValue?.stakedAmount <= 0 ? true : false}
                onClick={() =>
                  HarveststhePoolsss(
                    pool?.isStakingTokenBnb,
                    pool?.isRewardTokenBnb,
                    pool?.contractAddress
                  )
                }
                className="btn-yellow"
              >
                Harvest
              </button> */}
            </div>
            <div className="bottom_item">
              <div className="text">
                <h6>
                  {userInfoValue?.amount
                    ? Web3?.utils
                      ?.fromWei(userInfoValue?.amount, "ether")
                      .slice(0, 6)
                    : 0}
                </h6>
                <p className="textSecondary text-truncate">
                  {pool?.stakingTokenSymbol} Staked
                </p>
              </div>
              <div className="btn_unstake">
                {userInfoValue?.amount > 0 ? (
                  /* basicModalunstake${index} onClick={() => UnstakethePoolss(pool?.isStakingTokenBnb, pool?.isRewardTokenBnb, pool?.contractAddress)} */
                  <button
                    onClick={() =>
                      account
                        ? window.$(`#basicModalunstake${index}`).modal("show")
                        : toast.error("Please Connect to wallet")
                    }
                    className="btn-yellow"
                  >
                    UnStake
                  </button>
                ) : (
                  <button
                    className="btn-yellow"
                    // data-toggle="modal"
                    // data-target={`#basicModal${index}`}
                    onClick={() => modalAndBalance(pool, index)}
                  >
                    STAKE
                  </button>
                )}
              </div>
            </div>
            <div className="modal1">
              <div
                class="modal fade"
                id={`basicModal${index}`}
                tabindex="-1"
                role="dialog"
                aria-labelledby="basicModal"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">
                        Stake {pool?.stakingTokenSymbol}-
                        {pool?.rewardTokenSymbol} ({index})
                      </h4>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() =>
                          window.$(`#basicModal${index}`).modal("hide")
                        }
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
                        <input
                          type="number"
                          value={stakeVal}
                          onChange={(e) => getstakeVal(e)}
                          placeholder={`Enter ${pool?.stakingTokenSymbol} No...`}
                        />
                        <button
                          onClick={() =>
                            setStakeVal(
                              pool?.isStakingTokenBnb ? balance1 : tokenBalance
                            )
                          }
                          className="btn-yellow"
                        >
                          Max
                        </button>
                      </div>
                      <p>
                        Available balance:{" "}
                        <span>
                          {pool?.isStakingTokenBnb
                            ? balance1
                            : tokenBalance
                              ? pool?.isStakingTokenBnb
                                ? balance1
                                : tokenBalance
                              : 0.0}
                        </span>{" "}
                      </p>
                      {/* <div className="switch">
                        <div class="custom-control custom-switch">
                          <input
                            type="checkbox"
                            class="custom-control-input"
                            id="customSwitch2"
                            disabled
                            checked={pool?.autoCompound}
                          />
                          <label class="custom-control-label padd1" for="customSwitch2">
                            Auto Compound
                          </label>
                        </div>
                      </div> */}
                      <div className="bottom-btn">
                        {/* <button onClick={() => StakingP(pool?.isStakingTokenBnb, pool?.isRewardTokenBnb, pool?.stakingTokenAddress, pool?.contractAddress, stakeVal, 30)} disabled={pool?.isStakingTokenBnb ? balance1 : tokenBalance < stakeVal || stakeVal === 0} className={pool?.isStakingTokenBnb ? balance1 : tokenBalance < stakeVal ? 'btn-yellow btn-danger' : "btn-yellow"} >{pool?.isStakingTokenBnb ? balance1 : tokenBalance < stakeVal ? 'Your Balance is Insufficent' : 'Stake'}</button> */}
                        <button
                          disabled={
                            pool?.isStakingTokenBnb
                              ? stakeVal <= 0 ||
                              balance1 <= 0 ||
                              stakeVal > balance1
                              : parseInt(stakeVal) <= 0 ||
                              tokenBalance <= 0 ||
                              parseInt(stakeVal) > tokenBalance
                          }
                          onClick={() =>
                            StakingP(
                              pool?.isStakingTokenBnb,
                              pool?.isRewardTokenBnb,
                              pool?.stakingTokenAddress,
                              pool?.contractAddress,
                              stakeVal,
                              30,
                              index
                            )
                          }
                          className={"btn-yellow"}
                        >
                          {"Stake"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal1">
              <div
                class="modal fade"
                id={`basicModalunstake${index}`}
                tabindex="-1"
                role="dialog"
                aria-labelledby="basicModal"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">
                        UnStake {pool?.stakingTokenSymbol}-
                        {pool?.rewardTokenSymbol}
                      </h4>
                      <button
                        type="button"
                        class="close"
                        onClick={() =>
                          window.$(`#basicModalunstake${index}`).modal("hide")
                        }
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
                      <div className="timer">
                        {/* <h6>{lockPeriodValue}----{userInfoValue?.endtime}</h6> */}
                        <ul className="list-inline">
                          <TimerCustom timeLeft={timeLeft > 0 ? timeLeft : 0} />
                        </ul>
                      </div>
                      <div className="bottom-btn">
                        {timeLeft < 0  && <>
                            <button
                             onClick={() =>
                                UnstakethePoolss(
                                  pool?.isStakingTokenBnb,
                                  pool?.isRewardTokenBnb,
                                  pool?.contractAddress,
                                  index,
                                )
                              }
                              className="btn-yellow"
                            >
                              UnStake 
                            </button>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardDiv>
        </div>
      )}
    </>
  );
};

export default VPoolCard;
