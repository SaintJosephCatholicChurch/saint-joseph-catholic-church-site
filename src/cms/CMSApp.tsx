import CMS, {
  BooleanWidget,
  ColorStringWidget,
  DateTimeWidget,
  FileWidget,
  GitHubBackend,
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
} from '@staticcms/core';

const loadCmsApp = () => {
  // Register all the things
  CMS.registerBackend('github', GitHubBackend);
  CMS.registerBackend('proxy', ProxyBackend);
  CMS.registerWidget([
    StringWidget(),
    NumberWidget(),
    TextWidget(),
    ImageWidget(),
    FileWidget(),
    SelectWidget(),
    MarkdownWidget(),
    ListWidget(),
    ObjectWidget(),
    RelationWidget(),
    BooleanWidget(),
    DateTimeWidget(),
    ColorStringWidget()
  ]);
  CMS.registerLocale('en', locales.en);

  return CMS;
};

export default loadCmsApp;
