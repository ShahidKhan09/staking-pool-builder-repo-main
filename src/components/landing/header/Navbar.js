import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.scss";
import { HashLink } from "react-router-hash-link";
import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../../../hooks/useAuth";

const Navbar = ({ colorData }) => {
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  console.log('navbar data', colorData)
  const connectMetamask = () => {
    localStorage.setItem("connectorId", "injected");
    if (account) {
      logout();
    } else {
      login("injected");
    }
  };

  const close = () => {
    window.$("#myModal2").modal("hide");
  };

  const openn = () => {
    window.$("#myModal2").modal("show");
  };

  const trustWallet = async () => {
    localStorage.setItem("connectorId", "walletconnect");
    if (account) {
      logout();
    } else {
      login("walletconnect");
    }
  };

  return (
    <>
      <section className="main-navbar" style={{ backgroundColor: `${colorData?.headerBackGroundColor}` }}>
        <div className="container-fluid padd">
          <div className="row">
            <div className="col-xl-11 col-lg-11 m-auto padd">
              <nav className="navbar ptb20 navbar-expand-xl">
                <NavLink to="/" className="navbar-brand webLogo">
                {colorData?.projectLogo && <img
                    src={colorData?.projectLogo || ""}
                    alt=""
                    className="img-fluid hbdsjbd"
                  /> }
                  <p className="ml-2 text-capitalize" style={{color:`${colorData?.logoTextColor}`}}>{colorData?.projectName ||''}</p>
                </NavLink>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="togg">
                    <i class="fas fa-bars"></i>
                  </span>
                </button>

                <div
                  className="collapse navbar-collapse marg"
                  id="navbarSupportedContent"
                >
                  <div className="align-left ">
                    {account ? (
                      <button
                        type="button"
                        class="btn-yellow sbvsx "
                        onClick={() => {
                          logout();
                        }}
                        style={{ backgroundColor: `${colorData?.accentColor}` , color: `${colorData?.buttonTextColor}`}}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        class="btn-yellow sbvsx"
                        onClick={openn}
                        style={{ backgroundColor: `${colorData?.accentColor}` , color: `${colorData?.buttonTextColor}`}}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div
        class="modal right fade"
        id="myModal2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel2"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                // data-dismiss="modal"
                aria-label="Close"
                onClick={close}
              >
                <img
                  src="./assests\CardsImg\close.svg"
                  className="img-fluid"
                ></img>
              </button>
              <div className="upper_text">
                <h4 class="modal-title heading_modal" id="myModalLabel2">
                  Connect Wallet
                </h4>
                <p className="para_modal">
                  By connecting your wallet, you agree to our <br />
                  <a href="#"> Terms of Service</a> and Our{" "}
                  <a href="#">Privacy Policy</a> .
                </p>
              </div>
            </div>

            <div class="modal-body">
              <div className="inner_btn">
                <button
                  type="button"
                  className="btn btn-btn-button d-block mb_bottom"
                  onClick={() => {
                    connectMetamask();
                    close();
                  }}
                // data-dismiss="modal"
                >
                  <img
                    style={{}}
                    src="./assests\CardsImg\metamas.svg"
                    className="img-fluid"
                  ></img>{" "}
                  Metamask
                </button>
                <button
                  type="button"
                  className="btn btn-btn-button "
                  onClick={() => {
                    trustWallet();
                    close();
                  }}
                  data-dismiss="modal"
                >
                  <img
                    src="./assests\CardsImg\wal.svg"
                    alt=""
                    className="img-fluid "
                  ></img>
                  WalletConnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
