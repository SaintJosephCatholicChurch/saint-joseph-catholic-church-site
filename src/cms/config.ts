import type { BaseField, Config } from '@staticcms/core';

export interface TimesField extends BaseField {
  widget: 'times';
}

export interface HtmlField extends BaseField {
  widget: 'html';
  sanitize_preview?: boolean;
}

export interface EventsField extends BaseField {
  widget: 'events';
}

const config: Config<TimesField | HtmlField | EventsField> = {
  backend: {
    name: 'github',
    repo: 'SaintJosephCatholicChurch/saint-joseph-catholic-church-site',
    branch: 'main'
  },
  media_folder: '/public/files',
  public_folder: '/files',
  slug: {
    encoding: 'ascii',
    clean_accents: true,
    sanitize_replacement: '-'
  },
  collections: [
    {
      name: 'church',
      label: 'Church Details',
      icon: 'church',
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
              name: 'additional_phones',
              label: 'Additional Phone Numbers',
              widget: 'list',
              required: false,
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string'
                },
                {
                  name: 'phone',
                  label: 'Phone Number',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'email',
              label: 'Email',
              widget: 'string'
            },
            {
              name: 'additional_emails',
              label: 'Additional Emails',
              widget: 'list',
              required: false,
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string'
                },
                {
                  name: 'email',
                  label: 'Email',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'contacts',
              label: 'Contacts',
              widget: 'list',
              required: false,
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'livestream_provider',
              label: 'Livestream Provider',
              widget: 'select',
              options: [
                { value: 'youtube', label: 'YouTube' },
                { value: 'facebook', label: 'Facebook' }
              ]
            },
            {
              name: 'facebook_page',
              label: 'Facebook Page',
              widget: 'string'
            },
            {
              name: 'youtube_channel',
              label: 'YouTube Channel',
              widget: 'string'
            },
            {
              name: 'google_map_location',
              label: 'Google Map Embed URL',
              widget: 'string'
            },
            {
              name: 'online_giving_url',
              label: 'Online Giving URL',
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
          name: 'staff',
          label: 'Staff',
          file: 'content/staff.json',
          description: 'Parish staff',
          fields: [
            {
              name: 'staff',
              label: 'Staff',
              widget: 'list',
              summary: '{{fields.name}} - {{field.image}}',
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string'
                },
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'picture',
                  label: 'Picture',
                  widget: 'image',
                  media_folder: '/public/staff',
                  public_folder: '/staff'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'homepage',
      label: 'Homepage',
      icon: 'house',
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
                  widget: 'string',
                  required: false
                }
              ]
            },
            {
              name: 'invitation_text',
              label: 'Invitation Text',
              widget: 'string'
            },
            {
              name: 'live_stream_button',
              label: 'Live Stream Button',
              widget: 'object',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'url',
                  label: 'URL',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'schedule_section',
              label: 'Scehdule Section',
              widget: 'object',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'schedule_background',
                  label: 'Schedule Background',
                  widget: 'image'
                }
              ]
            },
            {
              name: 'daily_readings',
              label: 'Daily Readings',
              widget: 'object',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  widget: 'string'
                },
                {
                  name: 'subtitle',
                  label: 'Subtitle',
                  widget: 'string'
                },
                {
                  name: 'daily_readings_background',
                  label: 'Background',
                  widget: 'image'
                }
              ]
            },
            {
              name: 'featured',
              label: 'Featured Pages / Links',
              label_singular: 'Featured Page / Link',
              widget: 'list',
              types: [
                {
                  label: 'Featured Page',
                  name: 'featured_page',
                  widget: 'object',
                  summary: "{{fields.page | split('|', '$2')}}",
                  fields: [
                    {
                      name: 'image',
                      label: 'Image',
                      widget: 'image',
                      required: false
                    },
                    {
                      name: 'page',
                      label: 'Page',
                      widget: 'relation',
                      collection: 'pages',
                      search_fields: ['title'],
                      display_fields: ['title'],
                      value_field: '{{slug}}|{{title}}'
                    },
                    {
                      name: 'summary',
                      label: 'Summary',
                      widget: 'text',
                      required: false
                    }
                  ]
                },
                {
                  label: 'Featured Link',
                  name: 'featured_link',
                  widget: 'object',
                  summary: '{{fields.title}}',
                  fields: [
                    {
                      name: 'image',
                      label: 'Image',
                      widget: 'image',
                      required: false
                    },
                    {
                      name: 'title',
                      label: 'Title',
                      widget: 'string'
                    },
                    {
                      name: 'url',
                      label: 'URL',
                      widget: 'string'
                    },
                    {
                      name: 'summary',
                      label: 'Summary',
                      widget: 'text',
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'bulletins',
      label: 'Bulletins',
      icon: 'newspaper',
      label_singular: 'Bulletin',
      folder: 'content/bulletins/',
      extension: 'json',
      format: 'json',
      create: true,
      slug: "{{fields.date | date('YYYYMMDD')}}",
      summary: "{{date | date('MMM DD, YYYY')}} - {{fields.name}}",
      sortable_fields: {
        fields: ['date'],
        default: {
          field: 'date',
          direction: 'Descending'
        }
      },
      editor: {
        preview: false
      },
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
          format: 'YYYY-MM-DD',
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
    },
    {
      name: 'news',
      label: 'News Posts',
      label_singular: 'News Post',
      folder: 'content/posts/',
      extension: 'mdx',
      format: 'frontmatter',
      create: true,
      identifier_field: 'title',
      summary: "{{title}} ({{date | date('MMM DD, YYYY')}})",
      sortable_fields: {
        fields: ['title', 'date'],
        default: {
          field: 'date',
          direction: 'Descending'
        }
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'image',
          label: 'Image',
          widget: 'image',
          required: false
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
          required: false,
          fields: [
            {
              label: 'Tag',
              name: 'tag',
              widget: 'relation',
              collection: 'tags',
              file: 'tags',
              search_fields: ['tags.*.tag'],
              display_fields: ['tags.*.tag'],
              value_field: 'tags.*.tag'
            }
          ]
        },
        {
          name: 'body',
          label: 'Body',
          widget: 'html'
        }
      ]
    },
    {
      name: 'pages',
      label: 'Pages',
      icon: 'file-lines',
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
          name: 'body',
          label: 'Body',
          widget: 'html'
        }
      ]
    },
    {
      name: 'tags',
      label: 'Tags',
      icon: 'tag',
      delete: false,
      editor: {
        preview: false
      },
      files: [
        {
          name: 'tags',
          label: 'Tags',
          file: 'content/meta/tags.json',
          description: 'List of tags',
          fields: [
            {
              name: 'tags',
              label: 'Tags',
              label_singular: 'Tag',
              widget: 'list',
              summary: '{{tag}}',
              fields: [
                {
                  name: 'tag',
                  label: 'Tag',
                  widget: 'string'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'config',
      label: 'Site Config',
      icon: 'gear',
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
              name: 'site_image',
              label: 'Site Image',
              widget: 'image'
            },
            {
              name: 'site_keywords',
              label: 'Site keywords',
              widget: 'list',
              summary: '{{fields.keyword}}',
              fields: [
                {
                  name: 'keyword',
                  label: 'Keyword',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'posts_per_page',
              label: 'News Posts Per Page',
              widget: 'number'
            },
            {
              name: 'privacy_policy_url',
              label: 'Privacy Policy URL',
              widget: 'string'
            }
          ]
        },
        {
          name: 'menu',
          label: 'Menu & Logo',
          file: 'content/menu.json',
          description: 'Site menu and logo',
          editor: {
            preview: true
          },
          fields: [
            {
              name: 'logo',
              label: 'Logo',
              widget: 'object',
              fields: [
                {
                  name: 'primary',
                  label: 'Primary',
                  widget: 'string'
                },
                {
                  name: 'secondary',
                  label: 'Secondary',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'online_giving_button_text',
              label: 'Online Giving Button Text',
              widget: 'string',
              hint: 'Online giving link is set in Church > Church Details'
            },
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
          name: 'styles',
          label: 'Site Styles',
          file: 'content/styles.json',
          description: 'General site styles',
          fields: [
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
