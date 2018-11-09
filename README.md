# gatsby-plugin-amp

Formats AMP-specific pages by removing javascript, combining styles and adding boilerplate. Read more about AMP (Accelerated Mobile Pages) [here](https://www.ampproject.org/).

## Install

`npm install --save gatsby-plugin-amp`

# How to use

Create AMP-specific templates. Assume you have the following blog post template in `post.js`

```javascript
import React from 'react'
import Img from 'gatsby-image'
import Layout from '../../components/layout'

export default ({ data }) => (
  <Layout>
    <Img fluid={data.image.fluid} />
    <h1>REGULAR PAGE</h1>
    <p>regular page content</p>
  </Layout>
)
```

Create an AMP template `post.amp.js`

```javascript
import React from 'react'
import Layout from '../../components/layout'

export default ({ data }) => (
  <Layout>
    <amp-img src-set={data.image.srcSet} src={data.image.src} width={data.image.width} height={data.image.height} alt={data.image.altText} layout="responsive" />
    <h1>AMP PAGE</h1>
    <p>amp page content</p>
  </Layout>
)
```

While creating posts in your `gatsby-node.js` file, create an additional page in the `/amp/` directory using the AMP template you just made

```javascript
_.each(posts, (post, index) => {
  const previous = index === posts.length - 1 ? null : posts[index + 1].node;
  const next = index === 0 ? null : posts[index - 1].node;

  createPage({
    path: post.node.fields.slug,
    component: path.resolve('./src/templates/post.js'),
    context: {
      slug: post.node.fields.slug,
      previous,
      next,
    },
  })

  createPage({
    path: `/amp/${post.node.fields.slug}`,
    component: path.resolve('./src/templates/post.amp.js'),
    context: {
      slug: post.node.fields.slug,
      previous,
      next,
    },
  })
})
```

When you build your site, you should now have pages at `/my-awesome-post/index.html` and `/amp/my-awesome-post/index.html`

Add the plugin to the plugins array in your `gatsby-config.js`

```javascript
{
  resolve: `gatsby-plugin-amp`,
  options: {
    analytics: {
      type: 'gtag',
      dataCredentials: 'include',
      config: {
        vars: {
          gtag_id: <GA_TRACKING_ID>,
          config: {
            <GA_TRACKING_ID>: {
              page_location: '{{pathname}}'
            },
          },
        },
      },
    },
    canonicalBaseUrl: 'http://www.example.com/',
    components: ['amp-form'],
    excludedPaths: ['/404.html', '/'],
    googleTagManager: {
      containerId: 'GTM-1234567',
    },
    pathIdentifier: '/amp/',
    useAmpClientIdApi: true,
  },
},
```

When your site builds, your page in the `/amp` directory should now be a valid AMP page

# Options

**analytics** `{Object}`
If you want to include any `amp-analytics` tags, set that configuration here.

&nbsp;&nbsp;&nbsp;&nbsp;**type** `{String}`
&nbsp;&nbsp;&nbsp;&nbsp;Your analytics type. See the list of available vendors [here](https://www.ampproject.org/docs/analytics/analytics-vendors). 

&nbsp;&nbsp;&nbsp;&nbsp;**dataCredentials** `{String}`
&nbsp;&nbsp;&nbsp;&nbsp;You value for the `data-credentials` attribute. Omit to remove the attribute.

&nbsp;&nbsp;&nbsp;&nbsp;**config** `{Object | String}`
&nbsp;&nbsp;&nbsp;&nbsp;This can be either an object containing your analytics configuration or a url to your analytics configuration. If you use Google Analytics gtag, your cofiguration might look like this:

```javascript
vars: {
  gtag_id: <GA_TRACKING_ID>,
  config: {
    <GA_TRACKING_ID>: {
      page_location: '{{pathname}}'
    },
  },
},
```

&nbsp;&nbsp;&nbsp;&nbsp; If you use a tag manager, your config would simply be a url like `https://www.googletagmanager.com/amp.json?id=GTM-1234567&amp;gtm.url=SOURCE_URL`. You can use double curly braces to interpolate the pathname into a configuration value e.g. `page_location: '{{pathname}}'`. See [here](https://www.ampproject.org/docs/reference/components/amp-analytics) to learn more about `amp-analytics` configurations.

**canonicalBaseUrl** `{String}`
The base URL for your site. This will be used to create a `rel="canonical"` link in your amp template and `rel="amphtml"` link in your base page.

**components** `{Array<String>}`
The components you will need for your AMP templates. Read more about the available components [here](https://www.ampproject.org/docs/reference/components).

**excludedPaths**`{Array<String>}`
By default, this plugin will create `rel="amphtml"` links in all pages. If there are pages you would like to not have those links, include them here. *this may go away if a way can be found to programatically exclude pages based on whether or not they have an AMP equivalent. But for now, this will work*

**pathIdentifier** `{String}`
The url segment which identifies AMP pages. If your regular page is at `http://www.example.com/blog/my-awesome-post` and your AMP page is at `http://www.example.com/amp/blog/my-awesome-post`, your pathIdentifier should be `/amp/`

**useAmpClientIdApi** `{Boolean}`
If you are using a Client ID for Google Analytics, you can use the [Google AMP Client ID](https://support.google.com/analytics/answer/7486764) to determine if events belong to the same user when they visit your site on AMP and non-AMP pages. Set this to `true` if you would like to include the necessary meta tag in your AMP pages. You can read more about this concept [here](https://www.simoahava.com/analytics/accelerated-mobile-pages-via-google-tag-manager/#2-1-client-id)