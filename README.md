# Chong Zhi Ming portfolio

One static page. It has no build step and no dependencies.

```
index.html                   page content
style.css                    colours, fonts and layout
assets/
  photo.jpg                  square, at least 640 x 640 px
  Chong_Zhi_Ming_CV.pdf
  project-vfx.jpg            16:9, about 1280 x 720 px
  project-fyp.jpg            16:9, about 1280 x 720 px
```

## Edit the site

- To change a photo, screenshot or the CV, put a file with the same name in `assets/`.
- To change text, open `index.html` in any editor and edit the words between the tags.
- To change colours, fonts or layout, edit `style.css`. The colours are variables at the top of the file.
- To add a project, copy one `<article class="card">` block in the Work section and edit it.
- To preview, double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

A missing photo or screenshot shows a plain placeholder. A missing CV file makes the button return a 404 error, so upload the CV before you publish.

## Publish on GitHub Pages

1. On GitHub, create a public repository named exactly `chongzm3303-tako.github.io`.
2. Choose Add file, then Upload files. Drag in `index.html`, `style.css` and the `assets` folder, then commit.
3. Open Settings, then Pages. Under Build and deployment, choose Deploy from a branch, then `main` and `/ (root)`, and save.
4. After a minute or two the site is at https://chongzm3303-tako.github.io.

To update the site, edit the file on GitHub and commit, or upload a file with the same name.

## Use your own domain

1. Get a domain from one of the sources below.
2. In the repository, open Settings, then Pages, then Custom domain. Enter the domain and save. Do this before you change DNS.
3. At your domain provider, add these DNS records.
   - For the root domain (`yourname.me`), add four A records with host `@` and these values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - For `www.yourname.me`, add a CNAME record with host `www` and value `chongzm3303-tako.github.io`.
4. Wait for DNS to update, which takes minutes to a few hours. Then turn on Enforce HTTPS in Settings, then Pages.

## Free domain sources

| Source | Cost | Notes |
| --- | --- | --- |
| GitHub Student Developer Pack | Free for 1 year | A Namecheap `.me` domain, a Name.com domain (`.dev`, `.app` and others) or a `.tech` domain. You need verified current student status. Check the renewal price before year two. |
| is-a.dev | Free | A subdomain such as `chongzm3303.is-a.dev`. Fork the `is-a-dev/register` repository, add a JSON file and open a pull request. Volunteers run it, so reviews can take a while. Write the request yourself and follow their docs. |
| `chongzm3303-tako.github.io` | Free | Works as soon as Pages is on. |
| Paid domain | About US$10 to $15 a year for a `.com` | Buy from a registrar such as Namecheap, Cloudflare or Porkbun. |

Prices and eligibility change, so check each site before you sign up.
