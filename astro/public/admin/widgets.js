// Custom Decap CMS widgets. Decap supplies the globals CMS, h
// (React.createElement), and createClass.
(() => {
  const { CMS, h, createClass } = window;

  // "tags": comma-separated text saved as a YAML list of trimmed strings.
  // decap-cms 3.17.3's list widget rewrites its text on every keystroke and
  // drops a trailing space, so a tag like "Problem Solving" can't be typed.
  // This keeps the text as typed and tidies it when the field loses focus.
  const toArray = (value) => {
    const items = value && typeof value.toJS === 'function' ? value.toJS() : value;
    return Array.isArray(items) ? items.map(String) : [];
  };
  const parse = (text) => text.split(',').map((tag) => tag.trim()).filter(Boolean);
  const format = (tags) => tags.join(', ');
  const same = (a, b) => a.length === b.length && a.every((tag, index) => tag === b[index]);

  const TagsControl = createClass({
    getInitialState() {
      return { text: format(toArray(this.props.value)) };
    },
    componentDidUpdate() {
      // Follow outside changes to the value, such as an entry loading.
      const tags = toArray(this.props.value);
      if (!same(tags, parse(this.state.text))) this.setState({ text: format(tags) });
    },
    handleChange(event) {
      const text = event.target.value;
      this.setState({ text });
      this.props.onChange(parse(text));
    },
    handleBlur() {
      this.setState({ text: format(parse(this.state.text)) });
      this.props.setInactiveStyle();
    },
    render() {
      return h('input', {
        type: 'text',
        id: this.props.forID,
        className: this.props.classNameWrapper,
        value: this.state.text,
        onChange: this.handleChange,
        onFocus: this.props.setActiveStyle,
        onBlur: this.handleBlur,
      });
    },
  });

  const TagsPreview = ({ value }) => h('span', null, format(toArray(value)));

  CMS.registerWidget('tags', TagsControl, TagsPreview);
})();
