import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ReactPostfixInput extends Component {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    postfix: PropTypes.string,
    onChanged: PropTypes.func,
    inputFormat: PropTypes.func,
    isOnlyDigits: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = { value: '' }
  }

  removeNonDigitsChar = (val = '') => val.toString().replace(/[^0-9]/g, "")

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
      onChanged
    } = this.props

    let newVal = value
    if (isOnlyDigits) newVal = this.removeNonDigitsChar(newVal)
    if (inputFormat) newVal = inputFormat(newVal, this.state)

    this.setState(
      { value: newVal },
      () => this.updateCaretPosition(newVal, value, target, selectionStart, selectionEnd)
    )

    onChanged(newVal)
  }

  render() {
    const placeholder = this.props.placeholder || ''
    const type = this.props.type || 'text'
    const value = this.state.value
    const isHidden = value.length === 0
    const HIDDEN = 'hidden'

    return (
      <div className="fluid-input__wrapper">
        <div className="fluid-input">
          <input
            className="fluid-input__input"
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={event => this.update(event.target)}
          />
        </div>
        <div className={`fluid-input__shadowValue ${(isHidden) ? HIDDEN : ''}`}>
          <span className="shadow">{value}</span>
          <span className="postfix">{this.props.postfix}</span>
        </div>
      </div>
    )
  }
}
