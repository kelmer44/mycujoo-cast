const dPR = window.devicePixelRatio || 1

export default function checkUrlInLogo(src, size = 70) {
    return src.match(/http/)
        ? src
        : `https://mycujoo-static.imgix.net/${src}?w=${size * dPR}&h=${size * dPR}`
}
