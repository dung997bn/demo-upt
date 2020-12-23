import React, { Component, ReactNode } from "react";
import classNames from 'classnames';

interface Props {
    label: string | Element | null,
    style: object,
    className: string,
    onClick: () => void,
    children: [],
    onChange: (a: any) => void
}

interface State {
    active: boolean,
    label: string,
    node: HTMLDivElement | null
};
class DropDown extends Component<Props, State> {
    state: State = {
        active: false,
        label: "",
        node: null
    };
    constructor(props: Props) {
        super(props)
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.openList = this.openList.bind(this);
        this.select = this.select.bind(this);
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e: any) {
        if (this.state.node && !this.state.node.contains(e.target)) {
            this.setState(state => Object.assign(state, { active: false }));
        }
    }

    openList(e: any) {
        if (e.target.classList.contains('drop-down_head')) {
            this.setState(state => Object.assign(state, { active: !this.state.active }));
        }
    }

    select(val: any, meta: any) {
        this.setState(state => Object.assign(state, { label: val, active: false }));
        if (this.props.onChange) this.props.onChange(meta || val);
    }

    render() {
        const { label, style, onClick, children, className } = this.props;
        let list_item = (
            <div className="list">
                {
                    React.Children.map(children, child => React.cloneElement(child as any,
                        { onClick: () => this.select((child as any).props.children, (child as any).props['data-meta']!) })
                    )
                }
            </div>
        )

        return (
            <div
                className={classNames('drop-down', { active: this.state.active }, className)}
                style={style}
                onClick={onClick || this.openList}
                ref={(node) => { this.state.node = node; }}
            >
                <div className="drop-down_head">
                    <div className="label">{label}</div>
                    <svg className="icon">
                        <use xlinkHref={'#icon-list'} />
                    </svg>
                </div>
                {list_item}
            </div>
        );
    }
}

export default DropDown