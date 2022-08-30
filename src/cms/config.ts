import {
  CmsConfig as NetlifyCmsConfig,
  CmsCollection as NetlifyCmsCollection,
  CmsCollectionFile as NetlifyCmsCollectionFile,
  CmsField as NetlifyCmsField,
  CmsFieldBase
} from 'netlify-cms-core';

export interface CmsFieldTimes {
  widget: 'times';
}

export type CmsField =
  | NetlifyCmsField
  | (CmsFieldBase &
      (
        | CmsFieldTimes
      ));

export interface CmsCollectionFile extends Omit<NetlifyCmsCollectionFile, 'fields'> {
  fields: CmsField[];
}

export interface CmsCollection extends Omit<NetlifyCmsCollection, 'files' | 'fields'> {
  files?: CmsCollectionFile[];
  fields?: CmsField[];
}

export interface CmsConfig extends Omit<NetlifyCmsConfig, 'collections'> {
  collections: CmsCollection[];
}

const config: CmsConfig = {
  backend: {
    name: 'git-gateway',
    branch: 'main'
  },
  media_folder: 'public/images',
  public_folder: '/images',
  slug: {
    encoding: 'ascii',
    clean_accents: true,
    sanitize_replacement: '_'
  },
  collections: [
    {
      name: 'homepage',
      label: 'Homepage',
      delete: false,
      editor: {
        preview: true
      },
      files: [
        {
          name: 'homepage',
          label: 'Homepage',
          file: 'content/homepage.json',
          description: 'Homepage configuration',
          fields: [
            {
              name: 'slides',
              label: 'Slides',
              label_singular: 'Slide',
              widget: 'list',
              fields: [
                {
                  name: 'image',
                  label: 'Image',
                  widget: 'image'
                },
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'markdown',
                  required: false
                }
              ]
            },
            {
              name: 'schedule_background',
              label: 'Schedule Background',
              widget: 'image'
            },
            {
              name: 'schedule_background_fallback_color',
              label: 'Schedule Background Fallback Color',
              widget: 'color'
            }
          ]
        }
      ]
    },
    {
      name: 'church',
      label: 'Church Details',
      delete: false,
      editor: {
        preview: true
      },
      files: [
        {
          name: 'church_details',
          label: 'General Church Details',
          file: 'content/church_details.json',
          description: 'General church details',
          fields: [
            {
              name: 'name',
              label: 'Name',
              widget: 'string'
            },
            {
              name: 'address',
              label: 'Address',
              widget: 'string'
            },
            {
              name: 'city',
              label: 'City',
              widget: 'string'
            },
            {
              name: 'state',
              label: 'State',
              widget: 'string'
            },
            {
              name: 'zipcode',
              label: 'Zip Code',
              widget: 'string'
            },
            {
              name: 'phone',
              label: 'Phone Number',
              widget: 'string'
            },
            {
              name: 'email',
              label: 'Email',
              widget: 'string'
            },
            {
              name: 'mission_statement',
              label: 'Mission Statement',
              widget: 'text'
            },
            {
              name: 'vision_statement',
              label: 'Vision Statement',
              widget: 'text'
            }
          ]
        },
        {
          name: 'times',
          label: 'Mass & Confession Times',
          file: 'content/times.json',
          description: 'Mass & Confession Times',
          fields: [
            {
              name: 'times',
              label: 'Times',
              widget: 'times'
            }
          ]
        },
        {
          name: 'bulletins',
          label: 'Parish Bulletins',
          file: 'content/bulletins.json',
          description: 'Parish bulletins',
          fields: [
            {
              name: 'bulletins',
              label: 'Bulletins',
              widget: 'list',
              summary: "{{date | date('MMM DD, YYYY')}} - {{fields.name}}",
              add_to_top: true,
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string',
                  default: 'Bulletin'
                },
                {
                  name: 'date',
                  label: 'Date',
                  widget: 'datetime',
                  date_format: 'MMM DD, YYYY',
                  time_format: false
                },
                {
                  name: 'pdf',
                  label: 'PDF',
                  widget: 'file',
                  media_folder: '/public/bulletins',
                  public_folder: '/bulletins'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'meta',
      label: 'Meta',
      delete: false,
      editor: {
        preview: false
      },
      files: [
        {
          name: 'authors',
          label: 'Authors',
          file: 'content/meta/authors.yml',
          description: 'Author descriptions',
          fields: [
            {
              name: 'authors',
              label: 'Authors',
              label_singular: 'Author',
              widget: 'list',
              fields: [
                {
                  name: 'slug',
                  label: 'Slug',
                  widget: 'string',
                  hint: 'The part of a URL identifies the author'
                },
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string',
                  hint: 'First and Last'
                },
                {
                  name: 'introduction',
                  label: 'Introduction',
                  widget: 'text'
                }
              ]
            }
          ]
        },
        {
          name: 'tags',
          label: 'Tags',
          file: 'content/meta/tags.yml',
          description: 'List of tags',
          fields: [
            {
              name: 'tags',
              label: 'Tags',
              label_singular: 'Tag',
              widget: 'list',
              fields: [
                {
                  name: 'slug',
                  label: 'Slug',
                  widget: 'string',
                  hint: 'The part of a URL identifies the tag'
                },
                {
                  name: 'name',
                  label: 'Display Name',
                  widget: 'string',
                  hint: 'Tag name for displaying on the site'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'posts',
      label: 'Posts',
      folder: 'content/posts/',
      extension: 'mdx',
      format: 'frontmatter',
      create: true,
      slug: '{{slug}}',
      identifier_field: 'slug',
      summary: '{{title}}',
      fields: [
        {
          name: 'slug',
          label: 'Slug',
          widget: 'string'
        },
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'date',
          label: 'Publish Date',
          widget: 'datetime',
          format: 'YYYY-MM-DD',
          date_format: 'YYYY-MM-DD',
          time_format: false
        },
        {
          name: 'author',
          label: 'Author',
          widget: 'relation',
          collection: 'meta',
          file: 'authors',
          search_fields: ['authors.*.name'],
          display_fields: ['authors.*.name'],
          value_field: 'authors.*.slug'
        },
        {
          name: 'tags',
          label: 'Tags',
          label_singular: 'Tag',
          widget: 'list',
          summary: '{{fields.tag}}',
          field: {
            label: 'Tag',
            name: 'tag',
            widget: 'relation',
            collection: 'meta',
            file: 'tags',
            search_fields: ['tags.*.name'],
            display_fields: ['tags.*.name'],
            value_field: 'tags.*.slug'
          }
        },
        {
          name: 'body',
          label: 'Body',
          widget: 'markdown'
        }
      ]
    },
    {
      name: 'pages',
      label: 'Pages',
      folder: 'content/pages/',
      extension: 'mdx',
      format: 'frontmatter',
      create: true,
      slug: '{{slug}}',
      identifier_field: 'slug',
      summary: '{{title}}',
      fields: [
        {
          name: 'slug',
          label: 'Slug',
          widget: 'string'
        },
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'date',
          label: 'Publish Date',
          widget: 'datetime',
          format: 'YYYY-MM-DD',
          date_format: 'YYYY-MM-DD',
          time_format: false
        },
        {
          name: 'tags',
          label: 'Tags',
          label_singular: 'Tag',
          widget: 'list',
          summary: '{{fields.tag}}',
          field: {
            name: 'tag',
            label: 'Tag',
            widget: 'relation',
            collection: 'meta',
            file: 'tags',
            search_fields: ['tags.*.name'],
            display_fields: ['tags.*.name'],
            value_field: 'tags.*.slug'
          }
        },
        {
          name: 'body',
          label: 'Body',
          widget: 'markdown'
        }
      ]
    },
    {
      name: 'config',
      label: 'Site Config',
      delete: false,
      editor: {
        preview: false
      },
      files: [
        {
          name: 'general',
          label: 'General Site Config',
          file: 'content/config.json',
          description: 'General site settings',
          fields: [
            {
              name: 'base_url',
              label: 'URL',
              widget: 'string',
              hint: 'Do not enter the trailing slash of the URL'
            },
            {
              name: 'site_title',
              label: 'Site title',
              widget: 'string'
            },
            {
              name: 'site_description',
              label: 'Site description',
              widget: 'string'
            },
            {
              name: 'logo',
              label: 'Logo',
              widget: 'image'
            },
            {
              name: 'site_keywords',
              label: 'Site keywords',
              widget: 'list',
              summary: '{{fields.keyword.keyword}}',
              field: {
                name: 'keyword',
                label: 'Keyword',
                widget: 'string'
              }
            },
            {
              name: 'twitter_account',
              label: 'Twitter account',
              widget: 'string'
            },
            {
              name: 'github_account',
              label: 'GitHub account',
              widget: 'string'
            }
          ]
        },
        {
          name: 'menu',
          label: 'Menu',
          file: 'content/menu.json',
          description: 'Parish bulletins',
          fields: [
            {
              name: 'menu_items',
              label: 'Menu Items',
              widget: 'list',
              summary: '{{fields.title}}',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'url',
                  label: 'URL',
                  widget: 'string',
                  required: false
                },
                {
                  name: 'page',
                  label: 'Page',
                  widget: 'relation',
                  collection: 'pages',
                  search_fields: ['title'],
                  display_fields: ['title'],
                  value_field: 'slug',
                  required: false
                },
                {
                  name: 'menu_links',
                  label: 'Menu Links',
                  widget: 'list',
                  summary: '{{fields.title}}',
                  required: false,
                  fields: [
                    {
                      name: 'title',
                      label: 'Title',
                      widget: 'string'
                    },
                    {
                      name: 'url',
                      label: 'URL',
                      widget: 'string',
                      required: false
                    },
                    {
                      name: 'page',
                      label: 'Page',
                      widget: 'relation',
                      collection: 'pages',
                      search_fields: ['title'],
                      display_fields: ['title'],
                      value_field: 'slug',
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'quick_links',
          label: 'Quick Links',
          file: 'content/quick_links.json',
          description: 'Parish bulletins',
          fields: [
            {
              name: 'quick_links',
              label: 'Quick Links',
              widget: 'list',
              summary: '{{fields.title}} ({{url}})',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'subtitle',
                  label: 'Subtitle',
                  widget: 'string',
                  required: false
                },
                {
                  name: 'url',
                  label: 'URL',
                  widget: 'string',
                  time_format: false
                },
                {
                  name: 'background',
                  label: 'Background Image',
                  widget: 'image'
                }
              ]
            }
          ]
        },
        {
          name: 'styles',
          label: 'Site Styles',
          file: 'content/styles.json',
          description: 'General site styles',
          fields: [
            {
              name: 'header_background',
              label: 'Header background',
              widget: 'image'
            },
            {
              name: 'header_color',
              label: 'Header color',
              widget: 'color'
            },
            {
              name: 'header_font_style',
              label: 'Header font style',
              widget: 'select',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Italic', value: 'italic' }
              ]
            },
            {
              name: 'footer_background',
              label: 'Footer background',
              widget: 'image'
            }
          ]
        }
      ]
    }
  ]
};

export default config;
