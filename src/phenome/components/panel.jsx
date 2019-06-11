import Utils from '../utils/utils';
import Mixins from '../utils/mixins';

/* phenome-dts-imports
import { Panel as PanelNamespace } from 'framework7/components/panel/panel';
*/

/* phenome-dts-instance
f7Panel: PanelNamespace.Panel
*/

export default {
  name: 'f7-panel',
  props: {
    id: [String, Number],
    className: String, // phenome-react-line
    style: Object, // phenome-react-line
    side: String,
    effect: String,
    cover: Boolean,
    reveal: Boolean,
    left: Boolean,
    right: Boolean,
    opened: Boolean,
    resizable: Boolean,
    ...Mixins.colorProps,
  },
  render() {
    const props = this.props;
    const {
      id,
      style,
      resizable,
    } = props;
    return (
      <div
        ref="el"
        id={id}
        style={style}
        className={this.classes}
      >
        <slot />
        {resizable && (
          <div className="panel-resize-handler"></div>
        )}
      </div>
    );
  },
  computed: {
    classes() {
      const self = this;
      const props = self.props;
      const { left, reveal, className, opened, resizable } = props;
      let { side, effect } = props;
      side = side || (left ? 'left' : 'right');
      effect = effect || (reveal ? 'reveal' : 'cover');
      return Utils.classNames(
        className,
        'panel',
        {
          'panel-active': opened,
          'panel-resizable': resizable,
          [`panel-${side}`]: side,
          [`panel-${effect}`]: effect,
        },
        Mixins.colorClasses(props),
      );
    },
  },
  watch: {
    'props.resizable': function watchResizable(resizable) {
      const self = this;
      if (!resizable) return;
      if (self.f7Panel && !self.f7Panel.resizableInitialized) {
        self.f7Panel.initResizablePanel();
      }
    },
    'props.opened': function watchOpened(opened) {
      const self = this;
      if (!self.$f7) return;
      const side = self.props.side || (self.props.left ? 'left' : 'right');
      if (opened) {
        self.$f7.panel.open(side);
      } else {
        self.$f7.panel.close(side);
      }
    },
  },
  componentDidCreate() {
    Utils.bindMethods(this, [
      'onOpen',
      'onOpened',
      'onClose',
      'onClosed',
      'onBackdropClick',
      'onPanelSwipe',
      'onPanelSwipeOpen',
      'onBreakpoint',
      'onResize',
    ]);
  },
  componentDidMount() {
    const self = this;
    const el = self.refs.el;
    const { side, effect, opened, left, reveal, resizable } = self.props;

    if (el) {
      el.addEventListener('panel:open', self.onOpen);
      el.addEventListener('panel:opened', self.onOpened);
      el.addEventListener('panel:close', self.onClose);
      el.addEventListener('panel:closed', self.onClosed);
      el.addEventListener('panel:backdrop-click', self.onBackdropClick);
      el.addEventListener('panel:swipe', self.onPanelSwipe);
      el.addEventListener('panel:swipeopen', self.onPanelSwipeOpen);
      el.addEventListener('panel:breakpoint', self.onBreakpoint);
      el.addEventListener('panel:resize', self.onResize);
    }

    self.$f7ready(() => {
      const $ = self.$$;
      if (!$) return;
      if ($('.panel-backdrop').length === 0) {
        $('<div class="panel-backdrop"></div>').insertBefore(el);
      }
      self.f7Panel = self.$f7.panel.create({ el, resizable });
    });

    if (opened) {
      el.style.display = 'block';
    }
    const $ = self.$$;
    if (!$) return;
    const panelSide = side || (left ? 'left' : 'right');
    const panelEffect = effect || (reveal ? 'reveal' : 'cover');
    if (opened) {
      $('html').addClass(`with-panel-${panelSide}-${panelEffect}`);
    }
  },
  componentWillUnmount() {
    const self = this;
    if (self.f7Panel) self.f7Panel.destroy();
    const el = self.refs.el;
    if (!el) return;

    el.removeEventListener('panel:open', self.onOpen);
    el.removeEventListener('panel:opened', self.onOpened);
    el.removeEventListener('panel:close', self.onClose);
    el.removeEventListener('panel:closed', self.onClosed);
    el.removeEventListener('panel:backdrop-click', self.onBackdropClick);
    el.removeEventListener('panel:swipe', self.onPanelSwipe);
    el.removeEventListener('panel:swipeopen', self.onPanelSwipeOpen);
    el.removeEventListener('panel:breakpoint', self.onBreakpoint);
    el.removeEventListener('panel:resize', self.onResize);
  },
  methods: {
    onOpen(event) {
      this.dispatchEvent('panel:open panelOpen', event);
    },
    onOpened(event) {
      this.dispatchEvent('panel:opened panelOpened', event);
    },
    onClose(event) {
      this.dispatchEvent('panel:close panelClose', event);
    },
    onClosed(event) {
      this.dispatchEvent('panel:closed panelClosed', event);
    },
    onBackdropClick(event) {
      this.dispatchEvent('panel:backdrop-click panelBackdropClick', event);
    },
    onPanelSwipe(event) {
      this.dispatchEvent('panel:swipe panelSwipe', event);
    },
    onPanelSwipeOpen(event) {
      this.dispatchEvent('panel:swipeopen panelSwipeOpen', event);
    },
    onBreakpoint(event) {
      this.dispatchEvent('panel:breakpoint panelBreakpoint', event);
    },
    onResize(event) {
      this.dispatchEvent('panel:resize panelResize', event);
    },
    open(animate) {
      const self = this;
      if (!self.$f7) return;
      const side = self.props.side || (self.props.left ? 'left' : 'right');
      self.$f7.panel.open(side, animate);
    },
    close(animate) {
      const self = this;
      if (!self.$f7) return;
      const side = self.props.side || (self.props.left ? 'left' : 'right');
      self.$f7.panel.close(side, animate);
    },
    toggle(animate) {
      const self = this;
      if (!self.$f7) return;
      const side = self.props.side || (self.props.left ? 'left' : 'right');
      self.$f7.panel.toggle(side, animate);
    },
  },
};
