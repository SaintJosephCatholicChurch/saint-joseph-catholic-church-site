import CMS, {
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
  NumberWidget,
  ObjectWidget,
  ProxyBackend,
  RelationWidget,
  SelectWidget,
  StringWidget,
  TextWidget
} from 'netlify-cms-core';

const loadCmsApp = () => {
  // Register all the things
  CMS.registerBackend('git-gateway', GitGatewayBackend as any);
  CMS.registerBackend('proxy', ProxyBackend as any);
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

  return CMS;
};

export default loadCmsApp;
