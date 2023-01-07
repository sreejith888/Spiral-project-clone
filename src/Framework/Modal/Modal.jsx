import React, { useState, useEffect } from 'react';
import BizClass from './Modal.module.scss';
import styled from "styled-components";
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import Draggable from 'react-draggable';
import Button from '../Button/Button';
import Portal from './Portal';

export default function Modal(props) {
  const { varient, title, children, draggable, onlymodal, className, index = 0, style, height, show, width, left, right, top, bottom, onlyfooter = false, ...restProps } = props;
  const [isModalAnimOpen, setModalAnimOpen] = useState(false);

  const toggleModalAnimOpen = () => {
    setModalAnimOpen(true);
    setTimeout(() => {
      setModalAnimOpen(false);
    }, 100);
  };

  useEffect(() => {
    document.addEventListener('keydown', keyDownHander, false);
  }, []);

  const keyDownHander = (e) => {
    if (e.shiftKey && e.keyCode == 27) {
      props.show();
    }
  };

  const Header = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupHeader");

  const Body = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupBody");

  const Footer = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupFooter");

  return (
    <Portal>
      <PopupBox Index={index + 1}>
        <Draggable handle="#handle" disabled={draggable === false ? true : false}>
          <PopupBox Index={index + 1} className={classNames(BizClass.popup, BizClass[varient], isModalAnimOpen ? BizClass.AnimOn : null, className)}
            height={height} width={width} left={left} right={right} top={top} bottom={bottom}>
            {onlymodal === true ? null : <header id="handle" className={BizClass.Header}>
              <h2>{title}</h2>
              <div className={BizClass.ContentBox}>
                {Header.length === 1 ? Header : null}
              </div>
              <a className={BizClass.CloseBtn} onClick={() => props.show()}>
                <FaTimes />
              </a>
            </header>}
            <form className={BizClass.FormContent} {...restProps}>
              <div className={BizClass.BodyContent}>
                {Body.length === 1 ? Body : null}
              </div>
              {Footer.length === 1 ? <footer className={BizClass.Footer}>
                <div className={BizClass.FooterBox}>
                  {Footer}
                  {onlyfooter === true ? null :
                    <Button type="button" varient="grey" onClick={() => props.show()}>
                      Cancel
                    </Button>
                  }
                </div>
              </footer> : null}
            </form>
          </PopupBox>
        </Draggable>
        <PopupBox Index={index} className={BizClass.Overlay} onClick={() => toggleModalAnimOpen()}></PopupBox>
      </PopupBox>
    </Portal>
  )
}

Modal.Header = function ModalHeader(props) {
  const { children } = props;
  return (
    <React.Fragment>{children}</React.Fragment>
  );
};

Modal.Body = function ModalBody(props) {
  const { children } = props;
  return (
    <React.Fragment>{children}</React.Fragment>
  );
};

Modal.Footer = function ModalFooter(props) {
  const { children } = props;
  return (
    <React.Fragment>{children}</React.Fragment>
  );
};

Modal.Header.displayName = "BizNextPopupHeader";
Modal.Body.displayName = "BizNextPopupBody";
Modal.Footer.displayName = "BizNextPopupFooter";

const PopupBox = styled.div.attrs((p) => ({}))`
&&& {
z-index: calc(var(--lg-Popup-zIndex) + ${(p) => p.Index});
min-height:${(p) => p.height};
height:${(p) => p.height};
width:${(p) => p.width};
min-width:${(p) => p.width};
left:${(p) => p.left};
right:${(p) => p.right};
top:${(p) => p.top};
bottom:${(p) => p.bottom};
}`;