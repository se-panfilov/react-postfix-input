import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FluidInput extends Component {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    postfix: PropTypes.string,
    onChanged: PropTypes.func,
    inputFormat: PropTypes.func,
    outputFormat: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = { local: '', output: '' }
  }

  updateCaretPosition = (newVal, value, target, selectionStart, selectionEnd) => {
    const lengthDiff = newVal.length - value.length
    const isLengthsEqual = (newVal.length === value.length)
    const start = isLengthsEqual ? selectionStart : selectionStart + lengthDiff
    const end = isLengthsEqual ? selectionEnd : selectionEnd + lengthDiff

    target.setSelectionRange(start, end)
  }

  update = target => {
    const {
      selectionEnd,
      selectionStart,
      value
    } = target

    const {
      isOnlyDigits,
      inputFormat,
      outputFormat,
      onChanged
    } = this.props

    const {
      local,
      output
    } = this.state

    let formattedInputVal
    let formattedOutputVal

    if (inputFormat) {
      formattedInputVal = inputFormat(value, local)
      if (formattedInputVal && formattedInputVal !== 0) {
        if (formattedInputVal !== local) this.setState({ local: formattedInputVal }, () => target.setSelectionRange(selectionStart, selectionEnd))
      }
    }

    // if (outputFormat) {
    //   formattedOutputVal = outputFormat(value, output)
    //   if (formattedOutputVal && formattedOutputVal !== 0) {
    //     if (formattedOutputVal !== output) this.setState({ output: formattedOutputVal })
    //   }
    // }

    this.setState(
      { local: formattedInputVal },
      () => this.updateCaretPosition(formattedInputVal, value, target, selectionStart, selectionEnd)
    )

    onChanged(output)
  }

  render() {
    const placeholder = this.props.placeholder || ''
    const type = this.props.type || 'text'
    const localValue = this.state.local
    const isHidden = localValue.length === 0
    const HIDDEN = 'hidden'

    return (
      <div className="fluid-input__wrapper">
        <div className="fluid-input">
          <input
            className="fluid-input__input"
            type={type}
            value={localValue}
            placeholder={placeholder}
            onChange={event => this.update(event.target)}
          />
        </div>
        <div className={`fluid-input__shadowValue ${(isHidden) ? HIDDEN : ''}`}>
          <span className="shadow">{localValue}</span>
          <span className="postfix">{this.props.postfix}</span>
        </div>
      </div>
    )
  }
}
