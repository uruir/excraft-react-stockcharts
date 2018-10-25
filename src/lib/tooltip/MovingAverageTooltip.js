

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { functor } from "../utils";

class SingleMAToolTip extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { labelFill } = this.props;
		const translate = "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")";
		return (
			<g transform={translate}>
				<line x1={0} y1={-10} x2={0} y2={2} stroke={this.props.color} strokeWidth="12px"/>
				<ToolTipText x={10} y={0} fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{this.props.displayName}</ToolTipTSpanLabel>
				</ToolTipText>
			</g>
		);
	}
}

SingleMAToolTip.propTypes = {
	origin: PropTypes.array.isRequired,
	color: PropTypes.string.isRequired,
	displayName: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	fontFamily: PropTypes.string,
	textFill: PropTypes.string,
	labelFill: PropTypes.string,
	fontSize: PropTypes.number,
	forChart: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	options: PropTypes.object.isRequired,
};

class MovingAverageTooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { displayValuesFor } = this.props;

		const { chartId } = moreProps;
		const { chartConfig } = moreProps;

		const { className, onClick, width, fontFamily, fontSize, textFill, labelFill } = this.props;
		const { origin: originProp, displayFormat, options } = this.props;
		const { chartConfig: { height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const config = chartConfig;

		const origin = functor(originProp);
		const [x, y] = origin(width, height);
		const [ox, oy] = config.origin;

		return (
			<g transform={`translate(${ ox + x }, ${ oy + y })`} className={className}>
				{options
					.map((each, idx) => {
						const yValue = currentItem && each.yAccessor(currentItem);

						const tooltipLabel = `${each.type} (${each.windowSize})`;
						const yDisplayValue = yValue ? displayFormat(yValue) : "n/a";
						return <SingleMAToolTip
							key={idx}
							origin={[width * idx, 0]}
							color={each.stroke}
							displayName={tooltipLabel}
							value={yDisplayValue}
							options={each}
							forChart={chartId}
							onClick={onClick}
							fontFamily={fontFamily}
							fontSize={fontSize}
							textFill={textFill}
							labelFill={labelFill}
						/>;
					})}
			</g>
		);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

MovingAverageTooltip.propTypes = {
	className: PropTypes.string,
	displayFormat: PropTypes.func.isRequired,
	origin: PropTypes.array.isRequired,
	displayValuesFor: PropTypes.func,
	onClick: PropTypes.func,
	textFill: PropTypes.string,
	labelFill: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	width: PropTypes.number,
	options: PropTypes.arrayOf(PropTypes.shape({
		yAccessor: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
		stroke: PropTypes.string.isRequired,
		windowSize: PropTypes.number.isRequired,
		echo: PropTypes.any,
	})),
};

MovingAverageTooltip.defaultProps = {
	className: "react-stockcharts-tooltip react-stockcharts-moving-average-tooltip",
	displayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 10],
	width: 65,
};

export default MovingAverageTooltip;
