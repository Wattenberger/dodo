import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classNames from "class-names";

import { areEqual, throttle } from '../../../utils';
import { Icon } from './../Icon/Icon';

import './Tooltip.scss';

export const placements = [ 'top', 'bottom', 'left', 'right' ];

class Tooltip extends Component {
    constructor(props) {
        super(props)

        // for perf, see https://github.com/facebook/react/issues/9851
        this.onScroll     = this.onScroll.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.setOffset    = this.setOffset.bind(this)

        this.state = {
            isShowing: false,
            isRendered: false,
            top: 0,
            left: 0,
            arrowXOffset: 0
        };
    }

    elem = React.createRef();
    contents = React.createRef();

    static propTypes = {
        contents: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
        placement: PropTypes.oneOf(placements),
        isExternallyControlled: PropTypes.bool,
        onClose: PropTypes.func,
        isKeptOnScroll: PropTypes.bool,
        iteration: PropTypes.number, // for triggering updates
    };

    static defaultProps = {
        placement: 'top',
        isExternallyControlled: false,
        isKeptOnScroll: false
    };

    getClassName() {
        return classNames('Tooltip', this.props.className);
    }

    componentDidMount() {
        if (this.props.isExternallyControlled) {
            this.setState({ isShowing: true, isRendered: true }, this.setOffset);
            return;
        }
        this.setOffset();
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (areEqual(prevProps, this.props, [ "contents", "placement", "isKeptOnScroll" ])) return;
        this.throttledSetOffset();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !areEqual(nextProps, this.props, [ "contents", "placement", "isKeptOnScroll", "children", "iteration" ]) ||
               !areEqual(nextState, this.state, [ "isShowing", "isRendered",  "top",  "left",  "arrowXOffset" ])
    }

    onScroll(e) {
        this.onMouseLeave();
    }

    onMouseEnter() {
        const { isKeptOnScroll, onMouseEnter } = this.props;

        this.setState({ isRendered: true }, () => {
            this.setState({ isShowing: true }, this.throttledSetOffset);
        });
        if (!isKeptOnScroll) {
            addEventListener('scroll', this.onScroll, {
                passive: true
            });
        }
        if (onMouseEnter) onMouseEnter();
    };

    onMouseLeave() {
        if (this.props.isExternallyControlled) return;
        const { onMouseLeave } = this.props;
        this.setState({ isShowing: false, isRendered: false });
        removeEventListener('scroll', this.onScroll);
        if (onMouseLeave) onMouseLeave();
    };

    setOffset() {
        if (!(this.state.isShowing && this.state.isRendered)) return;
        if (!this.contents.current || !this.elem.current) return;

        const { placement } = this.props;
        const windowWidth = innerWidth;
        const elemRect = this.contents.current.getBoundingClientRect() || {};
        const elemWidth = elemRect.width;
        const position = this.elem.current.getBoundingClientRect();
        const leftBuffer = 10;
        const rightBuffer = 30;
        const defaultLeft = position.left + position.width / 2;
        const translateXOffset = ["top", "bottom"].includes(placement) ? elemWidth / 2 : 0;

        const left =
            placement == 'left' ? position.left - elemWidth :
            placement == 'right' ? position.left + position.width :
            defaultLeft;
        const boundedLeft = Math.max(leftBuffer + translateXOffset, Math.min(windowWidth - rightBuffer - translateXOffset, left));
        const top = placement == 'top'    ? position.top :
                    placement == 'bottom' ? position.top + position.height + 8 :
                                            position.top + position.height / 2;

        const maxArrowMovement = elemWidth / 2 - 10;
        const arrowXOffset =
            [ 'top', 'bottom' ].includes(placement) &&
            Math.max(-maxArrowMovement, Math.min(maxArrowMovement, left - boundedLeft));
        this.setState({ left: boundedLeft, top, arrowXOffset });
    };
    throttledSetOffset = throttle(this.setOffset, 100);

    render() {
        const { isExternallyControlled, contents, placement, isKeptOnScroll, onClose, className, ...props } = this.props;
        const { top, left, arrowXOffset, isShowing, isRendered } = this.state;
        const portal = typeof document !== 'undefined' && document.getElementById('app-tooltip-portal');

        return (
            <div
                {...props}
                className={this.getClassName()}
                ref={this.elem}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {contents && portal && isRendered &&
                    ReactDOM.createPortal(
                        <div
                            className={classNames('Tooltip__contents', `Tooltip__contents--${placement}`, {
                                'Tooltip__contents--showing': isExternallyControlled || isShowing
                            }, (className || "").split(" ").map(d => `${d}__contents`))}
                            ref={this.contents}
                            style={{
                                left: `${left}px`,
                                top: `${top}px`
                            }}
                        >
                            <div
                                className="Tooltip__contents__arrow"
                                style={{
                                    marginLeft: arrowXOffset - 10,
                                }}
                            />
                            {!!onClose && (
                                <div
                                    className="Tooltip__contents__close"
                                    onClick={onClose}
                                >
                                    <Icon name="x" size="s" />
                                </div>
                            )}
                            {contents}
                        </div>,
                        portal
                    )}
                {this.props.children}
            </div>
        );
    }
}

export default Tooltip;
