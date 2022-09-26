import {
  BooleanWidget,
  ColorStringWidget,
  DateTimeWidget,
  FileWidget,
  GitGatewayBackend,
  Icon,
  imageEditorComponent,
  images,
  ImageWidget,
  ListWidget,
  locales,
  MarkdownWidget,
  NetlifyCmsCore as CMS,
  NumberWidget,
  ObjectWidget,
  ProxyBackend,
  RelationWidget,
  SelectWidget,
  StringWidget,
  TextWidget
} from 'netlify-cms-core';

// Register all the things
CMS.registerBackend('git-gateway', GitGatewayBackend);
CMS.registerBackend('proxy', ProxyBackend);
CMS.registerWidget([
  StringWidget.Widget(),
  NumberWidget.Widget(),
  TextWidget.Widget(),
  ImageWidget.Widget(),
  FileWidget.Widget(),
  SelectWidget.Widget(),
  MarkdownWidget.Widget(),
  ListWidget.Widget(),
  ObjectWidget.Widget(),
  RelationWidget.Widget(),
  BooleanWidget.Widget(),
  DateTimeWidget.Widget(),
  ColorStringWidget.Widget()
]);
CMS.registerEditorComponent(imageEditorComponent);
CMS.registerEditorComponent({
  id: 'code-block',
  label: 'Code Block',
  widget: 'code',
  type: 'code-block'
});
CMS.registerLocale('en', locales.en);

Object.keys(images).forEach((iconName) => {
  CMS.registerIcon(iconName, <Icon type={iconName} />);
});

export default CMS;
